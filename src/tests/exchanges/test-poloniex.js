const Poloniex = require('../../exchanges/Poloniex')
const assert = require('assert')

describe('Poloniex Exchange', function () {

  it('should instantiate a new exchange object', async function () {

    const poloniex = new Poloniex()
    
    assert(poloniex.name === 'Poloniex')
    assert(poloniex.baseUrl === 'https://poloniex.com')
    
  })

  it('should show getNormalizedOrderBook() works correctly ', async function () {
    
    const poloniex = new Poloniex()

    const baseSymbol = 'BTC'
    const quoteSymbol = 'ETH'
    const precision = 8

    const results = await poloniex.getNormalizedOrderBook(baseSymbol, quoteSymbol, precision)
    
    assert(typeof results.asks[0].quantity === 'number')
    assert(typeof results.asks[0].price === 'string')
    assert(typeof results.bids[0].quantity === 'number')
    assert(typeof results.bids[0].price === 'string')

    assert(results.exchange === 'Poloniex')
  })
  
})
