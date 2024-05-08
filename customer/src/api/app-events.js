const CustomerService = require('../services/customer-service')

module.exports = (app, channel) => {
  const service = new CustomerService()

  app.use('/app-events', async (req, res, next) => {
    try {
      const { payload } = req.body

      await service.SubscribeEvents(payload)

      console.log('Customer service received event!!!')
      return res.status(200).json(payload)
    } catch (error) {
      next(error)
    }
  })
}
