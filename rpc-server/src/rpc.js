const amqplib = require('amqplib')
const { v4: uuid } = require('uuid')

let connnection = null

const getChannel = async () => { 
  if (connnection === null) {
    connnection = await amqplib.connect('amqp://localhost:5672')
  }

  return await connnection.createChannel()
}

const expensiveDBOperation = async (fakeResponse, payload) => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeResponse)
    }, 1000)
  })
}

const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
  const channel = await getChannel()
  await channel.assertQueue(RPC_QUEUE_NAME, { durable: false })

  channel.prefetch(1)
  channel.consume(RPC_QUEUE_NAME, async (msg) => {
    console.log(`[${RPC_QUEUE_NAME}] received message!!`)
    if (msg.content) {
      const payload = JSON.parse(msg.content.toString())
      console.log(`content: ${JSON.stringify(payload)}`)

      const response = await expensiveDBOperation(fakeResponse, payload) // fake call db

      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(response)),
        {
          correlationId: msg.properties.correlationId
        }
      )

      channel.ack(msg)
    }
  }, { noAck: false })
}

const RPCRequest = async (RPC_QUEUE_NAME, payload) => {
  const uid = uuid()
  const channel = await getChannel()
  const queue = await channel.assertQueue('', { exclusive: true })

  channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
    replyTo: queue.queue,
    correlationId: uid
  })
  console.log(`Send message to [${RPC_QUEUE_NAME}] successfully, with the requestId ${uid}`)
  console.log(`expect replying to the [${queue.queue}]`)

  
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      channel.close()
      reject('API could not fullfill the request!!')
    }, 3000)

    channel.consume(queue.queue, (msg) => {
      console.log(`[${queue.queue}] received message!!`)
      clearTimeout(timeout)
      if (msg.properties.correlationId === uid) {
        const data = JSON.parse(msg.content.toString())

        console.log(`content: ${JSON.stringify(data)}`)
        resolve(data)
      } else {
        reject('Data not found')
      }
    }, { noAck: true })
  })
}

module.exports = {
  RPCObserver,
  RPCRequest
}