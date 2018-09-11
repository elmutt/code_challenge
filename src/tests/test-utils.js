const utils = require('../utils/utils')
const assert = require('assert')
const Poloniex = require('../exchanges/Poloniex')
const Bittrex = require('../exchanges/Bittrex')
const Binance = require('../exchanges/Binance')
const Hitbtc = require('../exchanges/Hitbtc')
const Kraken = require('../exchanges/Kraken')

describe('utils testing', function () {

  it('should test that detectOverlap() works correctly', async function () {

    const poloniex = new Poloniex()
    const bittrex = new Bittrex()
    const binance = new Binance()
    const hitbtc = new Hitbtc()
    const kraken = new Kraken()
    
    const base = 'BTC'
    const quote = 'ETH'
    const exchanges = [bittrex, poloniex, binance, hitbtc, kraken]
    
    const results = await utils.detectOverlap(base, quote, exchanges)
    // it might be empty.  we only know it should return an object correctly
    assert(typeof results === 'object')
  })

  it('should test that getCombinedOrderBook() works correctly', async function () {

    const poloniex = new Poloniex()
    const bittrex = new Bittrex()
    const binance = new Binance()
    const hitbtc = new Hitbtc()
    const kraken = new Kraken()
    
    const base = 'BTC'
    const quote = 'ETH'
    const precision = 8
    const exchanges = [bittrex, poloniex, binance, hitbtc, kraken] // TODO

    const results = await utils.getCombinedOrderBook(base, quote, exchanges, precision)

    assert(typeof results.bids[0].price  === 'string')
    assert(typeof results.bids[0].combinedOrderCount  === 'number')
    assert(typeof results.bids[0].exchangeQuantities[Object.keys(results.bids[0].exchangeQuantities)[0]]  === 'number')

    assert(typeof results.asks[0].price  === 'string')
    assert(typeof results.asks[0].combinedOrderCount  === 'number')
    assert(typeof results.asks[0].exchangeQuantities[Object.keys(results.asks[0].exchangeQuantities)[0]]  === 'number')

    assert(results.exchangesIncluded.length > 0)

  })

  it('should test that getSuportedSymbols() works correctly', async function () {
    const results = await utils.getSuportedSymbols()
    assert(results.includes('ETH'))
  })

  it('should test that getOrderBooks() works correctly', async function () {

    const poloniex = new Poloniex()
    const bittrex = new Bittrex()
    const binance = new Binance()
    const hitbtc = new Hitbtc()
    const kraken = new Kraken()
    
    const base = 'BTC'
    const quote = 'ETH'
    const precision = 8
    const exchanges = [bittrex, poloniex, binance, hitbtc, kraken] // TODO
    
    const results = await utils.getOrderBooks(base, quote, exchanges, precision)
    
    assert(typeof results[0].bids[0].quantity === 'number')
    assert(typeof results[0].bids[0].price === 'string')
    assert(typeof results[0].exchange === 'string')

    assert(typeof results[0].asks[0].quantity === 'number')
    assert(typeof results[0].asks[0].price === 'string')
    assert(typeof results[0].exchange === 'string')
    
  })
  
})
