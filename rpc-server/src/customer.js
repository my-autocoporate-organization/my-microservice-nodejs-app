const express = require('express')
const { RPCObserver, RPCRequest } = require('./rpc')
const app = express()
const PORT = 8000

app.use(express.json())

const fakeResponse = {
  _id: '66272a013b75be771ee7b3e2',
  email: 'test4@test.com',
  phone: '12345',
  address: [],
  orders: [],
  createdAt: '2024-04-23T03:24:49.881Z',
}

RPCObserver('CUSTOMER_RPC', fakeResponse)

app.get('/wishlist', async (req, res) => {

  try {
    
    const payload = {
      productId: '662739935cb858fbfcedb45b',
      customerId: '66272a013b75be771ee7b3e2'
    }
  
    const data = await RPCRequest('PRODUCT_RPC', payload)
    
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.get('/', (req, res) => {
  res.json('Customer Service!!')
})

app.listen(PORT, () => console.log(`Customer is listening on port: ${PORT}`))
