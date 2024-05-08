const bcrypt = require('bcrypt')
const amqplib = require('amqplib')
const jwt = require('jsonwebtoken')

const {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  QUEUE_NAME,
  CUSTOMER_BINDING_KEY,
} = require('../config')

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt()
}

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt)
}

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword
}

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' })
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization')
    console.log(signature)
    const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET)
    req.user = payload
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports.FormateData = (data) => {
  if (data) {
    return { data }
  } else {
    throw new Error('Data Not found!')
  }
}

// ============ MESSAGE BROKER ============
module.exports.CreateChannel = async () => {
  try {
    console.log('MSG_QUEUE_URL', MSG_QUEUE_URL)
    const connection = await amqplib.connect(MSG_QUEUE_URL)
    console.log('Message queue connected')
 
    const channel = await connection.createChannel()
    console.log('EXCHANGE_NAME', EXCHANGE_NAME)
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
    return channel
  } catch (error) {
    throw error
  }
}

module.exports.PublishMessage = async (channel, bindingKey, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, bindingKey, Buffer.from(message))
  } catch (error) {
    throw error
  }
}

module.exports.SubscribeMessage = async (channel, service) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME)

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY)

    channel.consume(appQueue.queue, (data) => {
      console.log('=== received data ===')
      console.log(data.content.toString())
      service.SubscribeEvents(JSON.parse(data.content.toString()))
      channel.ack(data)
    })
  } catch (error) {
    throw error
  }
}

// ============ END MESSAGE BROKER ============
