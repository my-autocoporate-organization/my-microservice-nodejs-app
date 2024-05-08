const dotEnv = require('dotenv')

let configFile = `././.env.${process.env.NODE_ENV}`

if (!process.env.NODE_ENV) {
  configFile = '././.env'
}

dotEnv.config({ path: configFile })

module.exports = {
  PORT: process.env.PORT,
  DB_URL: `${process.env.MONGODB_PREFIX}://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?authSource=admin`,
  APP_SECRET: process.env.APP_SECRET,
  MSG_QUEUE_URL: `${process.env.MSG_QUEUE_PREFIX}://${process.env.MSG_QUEUE_USERNAME}:${process.env.MSG_QUEUE_PASSWORD}@${process.env.MSG_QUEUE_HOST}`,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  PRODUCT_BINDING_KEY: process.env.PRODUCT_BINDING_KEY,
  CUSTOMER_BINDING_KEY: process.env.CUSTOMER_BINDING_KEY,
  SHOPPING_BINDING_KEY: process.env.SHOPPING_BINDING_KEY,
  QUEUE_NAME: 'SHOPPING_QUEUE',
}
