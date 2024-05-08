const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { customer } = require('./api')
const HandleErrors = require('./utils/error-handler')

module.exports = async (app, channel) => {
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: true, limit: '1mb' }))
    app.use(cors())
    app.use(express.static(__dirname + '/public'))
    app.use(morgan('[:date[web]] :req[header] ":method :url HTTP/:http-version :status" :response-time ms :res[content-length]'))

    //api
    customer(app, channel)

    // error handling
    app.use(HandleErrors)
}
