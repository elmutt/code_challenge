const combinerUtils = require('../utils/combiner-utils')
const assert = require('assert')

describe('combiner utils testing', function () {
  
  it('should test that combineSide() works correctly', async function () {

    const askPrice = '0.67'
    const bidPrice = '0.68'
      
    const orderBooks = [{
      bids: [{quantity: 1, price: bidPrice}],
      asks: [{quantity: 2, price: askPrice}],
      exchange: 'test1'
    },
      {
        bids: [{quantity: 3, price: bidPrice}],
        asks: [{quantity: 4, price: askPrice}],
        exchange: 'test1'
      }
    ]
    const resultsAsks = await combinerUtils.combineSide(orderBooks, 'asks')
    assert(resultsAsks[0].price === askPrice)
    assert(resultsAsks[0].exchangeQuantities.test1 === orderBooks[0].asks[0].quantity+orderBooks[1].asks[0].quantity)
    assert(resultsAsks[0].combinedOrderCount === 2)

    const resultsBids = await combinerUtils.combineSide(orderBooks, 'bids')
    assert(resultsBids[0].price === bidPrice)
    assert(resultsBids[0].exchangeQuantities.test1 === orderBooks[0].bids[0].quantity+orderBooks[1].bids[0].quantity)
    assert(resultsBids[0].combinedOrderCount === 2)
  })
  
  it('should test that combineOrders() works correctly', async function () {

    const orders = [ { quantity: 0.123, price: '0.456', exchange: 'test' }]
    const results = await combinerUtils.combineOrders(orders)
    
    assert(results.price === '0.456')
    assert(results.exchangeQuantities.test === 0.123)
    assert(results.combinedOrderCount === 1)
  })
  

})
