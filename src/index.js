const Poloniex = require('./exchanges/Poloniex')
const Bittrex = require('./exchanges/Bittrex')
const Binance = require('./exchanges/Binance')
const Hitbtc = require('./exchanges/Hitbtc')
const Kraken = require('./exchanges/Kraken')
const utils = require('./utils')

const poloniex = new Poloniex()
const bittrex = new Bittrex()
const binance = new Binance()
const hitbtc = new Hitbtc()
const kraken = new Kraken()

async function runApi() {
  
  const base = 'BTC'
  const quote = 'ETH'
  
  const poloniexResults = await poloniex.getNormalizedOrderBook(base, quote)
  const bittrexResults = await bittrex.getNormalizedOrderBook(base, quote)
  const binanceResults = await binance.getNormalizedOrderBook(base, quote)
  const hitbtcResults = await hitbtc.getNormalizedOrderBook(base, quote)
  const krakenResults = await kraken.getNormalizedOrderBook(base, quote)
  
  const combinedBook = utils.combineEverything([
    poloniexResults,
    bittrexResults,
    binanceResults,
    hitbtcResults,
    krakenResults
  ])

  /*
  combinedBook.asks.forEach( (ask) => {
    console.log(ask)
    console.log('')
  })
  */
  
  console.log('total length', JSON.stringify(combinedBook).length)
  
}

runApi()