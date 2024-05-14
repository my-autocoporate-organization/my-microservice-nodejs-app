const express = require('express')
const { RPCObserver } = require('./rpc')
const app = express()
const PORT = 9000

app.use(express.json())

app.get('/', (req, res) => {
  res.json('Product Service!!')
})

const fakeResponse = {
  _id: '662739935cb858fbfcedb45b',
  name: 'Olive Oil',
  desc: 'great Quality of Oil',
  banner: 'http://codergogoi.com/youtube/images/oliveoil.jpg',
  type: 'oils',
  unit: 1,
  price: 400,
  available: true,
  suplier: 'Golden seed firming',
  __v: 0,
}

RPCObserver('PRODUCT_RPC', fakeResponse)

app.listen(PORT, () => console.log(`Product is listening on port: ${PORT}`))
