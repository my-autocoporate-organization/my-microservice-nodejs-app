const mongoose = require('mongoose')
const { DB_URL } = require('../config')

module.exports = async () => {
  try {
    console.log(`DB_URL: ${DB_URL}`)
    await mongoose.connect(DB_URL, {
      autoIndex: true,
      family: 4,
    })
    console.log('DB connected')
  } catch (error) {
    console.log('Error ============')
    console.log(error)
    process.exit(1)
  }
}
