const Hitbtc = require('../../exchanges/Hitbtc')
const assert = require('assert')

describe('Hitbtc Exchange', function () {

  it('should instantiate a new exchange object', async function () {

    const hitbtc = new Hitbtc()
    
    assert(hitbtc.name === 'Hitbtc')
    assert(hitbtc.baseUrl === 'https://api.hitbtc.com')
    
  })

  it('should show getNormalizedOrderBook() works correctly ', async function () {
    
    const hitbtc = new Hitbtc()

    const baseSymbol = 'BTC'
    const quoteSymbol = 'ETH'
    const precision = 8

    const results = await hitbtc.getNormalizedOrderBook(baseSymbol, quoteSymbol, precision)
    
    assert(typeof results.asks[0].quantity === 'number')
    assert(typeof results.asks[0].price === 'string')
    assert(typeof results.bids[0].quantity === 'number')
    assert(typeof results.bids[0].price === 'string')

    assert(results.exchange === 'Hitbtc')
  })
  
})
