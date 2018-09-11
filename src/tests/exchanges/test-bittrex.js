const Bittrex = require('../../exchanges/Bittrex')
const assert = require('assert')

describe('Bittrex Exchange', function () {

  it('should instantiate a new exchange object', async function () {
    const bittrex = new Bittrex()
    assert(bittrex.name === 'Bittrex')
    assert(bittrex.baseUrl === 'https://bittrex.com')
    
  })

  it('should show getNormalizedOrderBook() works correctly ', async function () {
    
    const bittrex = new Bittrex()

    const baseSymbol = 'BTC'
    const quoteSymbol = 'ETH'
    const precision = 8

    const results = await bittrex.getNormalizedOrderBook(baseSymbol, quoteSymbol, precision)
    
    assert(typeof results.asks[0].quantity === 'number')
    assert(typeof results.asks[0].price === 'string')
    assert(typeof results.bids[0].quantity === 'number')
    assert(typeof results.bids[0].price === 'string')

    assert(results.exchange === 'Bittrex')
  })
  
})
