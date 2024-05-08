const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { ValidationError } = require('../utils/app-errors')

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository()
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
      return FormateData(orderResult)
    } catch (err) {
      throw new APIError('Data Not found', err)
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId)
      return FormateData(orders)
    } catch (err) {
      throw new APIError('Data Not found', err)
    }
  }

  SubscribeEvents(payload) {
    try {
      const { event, data } = payload

      const { userId, product, order, qty } = data

      switch (event) {
        case 'ADD_TO_CART':
          this.ManageCart(userId, product, qty, false)
          break
        case 'REMOVE_FROM_CART':
          this.ManageCart(userId, product, qty, true)
          break
        case 'CREATE_ORDER':
          this.ManageOrder(userId, order)
          break
        case 'TEST':
          console.log('Testing Event....')
          break
        default:
          break
      }
    } catch (error) {
      throw new ValidationError('Params is not valid', error)
    }
  }
}

module.exports = ShoppingService
