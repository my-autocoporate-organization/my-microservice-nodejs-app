const { ProductRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError, AppError, STATUS_CODES } = require('../utils/app-errors')

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository()
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs)
      return FormateData(productResult)
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products()

      let categories = {}

      products.map(({ type }) => {
        categories[type] = type
      })

      return FormateData({
        products,
        categories: Object.keys(categories),
      })
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetProductDescription(productId) {
    try {
      const product = await this.repository.FindById(productId)
      return FormateData(product)
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category)
      return FormateData(products)
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      const products = await this.repository.FindSelectedProducts(selectedIds)
      return FormateData(products)
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetProductById(productId) {
    try {
      return await this.repository.FindById(productId)
    } catch (err) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    try {
      const product = await this.GetProductById(productId)
      if (product) {
        const payload = {
          data: { product, qty, userId },
          event,
        }

        return FormateData(payload)
      }

      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    } catch (error) {
      throw new AppError('Data not found', STATUS_CODES.NOT_FOUND, 'data not found')
    }
  }
}

module.exports = ProductService
