const Kraken = require('../../exchanges/Kraken')
const assert = require('assert')

describe('Kraken Exchange', function () {

  it('should instantiate a new exchange object', async function () {

    const kraken = new Kraken()
    
    assert(kraken.name === 'Kraken')
    assert(kraken.baseUrl === 'https://api.kraken.com')
    
  })

  it('should show getNormalizedOrderBook() works correctly ', async function () {
    
    const kraken = new Kraken()

    const baseSymbol = 'BTC'
    const quoteSymbol = 'ETH'
    const precision = 8

    const results = await kraken.getNormalizedOrderBook(baseSymbol, quoteSymbol, precision)
    
    assert(typeof results.asks[0].quantity === 'number')
    assert(typeof results.asks[0].price === 'string')
    assert(typeof results.bids[0].quantity === 'number')
    assert(typeof results.bids[0].price === 'string')

    assert(results.exchange === 'Kraken')
  })
  
})
