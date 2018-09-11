const Binance = require('../../exchanges/Binance')
const assert = require('assert')

describe('Binance Exchange', function () {

  it('should instantiate a new exchange object', async function () {

    const binance = new Binance()
    
    assert(binance.name === 'Binance')
    assert(binance.baseUrl === 'https://api.binance.com')
    
  })

  it('should show getNormalizedOrderBook() works correctly ', async function () {
    
    const binance = new Binance()

    const baseSymbol = 'BTC'
    const quoteSymbol = 'ETH'
    const precision = 8

    const results = await binance.getNormalizedOrderBook(baseSymbol, quoteSymbol, precision)
    
    assert(typeof results.asks[0].quantity === 'number')
    assert(typeof results.asks[0].price === 'string')
    assert(typeof results.bids[0].quantity === 'number')
    assert(typeof results.bids[0].price === 'string')
    
    assert(results.exchange === 'Binance')
  })
  
})
