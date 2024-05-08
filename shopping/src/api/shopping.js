const ShoppingService = require('../services/shopping-service')
const { PublishCustomerEvent } = require('../utils')
// const UserService = require('../services/customer-service')
const UserAuth = require('./middlewares/auth')

module.exports = (app) => {
  const service = new ShoppingService()
  // const userService = new UserService()

  app.post('/order', UserAuth, async (req, res, next) => {
    const { _id } = req.user
    const { txnNumber } = req.body

    try {
      const { data } = await service.PlaceOrder({ _id, txnNumber })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  })

  app.get('/orders', UserAuth, async (req, res, next) => {
    const { _id } = req.user

    try {
      const { data } = await userService.GetShopingDetails(_id)
      return res.status(200).json(data.orders)
    } catch (err) {
      next(err)
    }
  })

  app.get('/cart', UserAuth, async (req, res, next) => {
    const { _id } = req.user
    try {
      const data = await PublishCustomerEvent({
        data: { userId: _id },
        event: 'GET_SHOPPING_DETAILS',
      })
      return res.status(200).json(data.cart)
    } catch (err) {
      next(err)
    }
  })
}
