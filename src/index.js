const Poloniex = require('./exchanges/Poloniex')
const Bittrex = require('./exchanges/Bittrex')
const Binance = require('./exchanges/Binance')
const Hitbtc = require('./exchanges/Hitbtc')
const Kraken = require('./exchanges/Kraken')
const fetch = require('node-fetch')
const config = require('../config')
const utils = require('./utils')
const express = require('express')
const cors = require('cors')
const app = express()
const rateLimit = require("express-rate-limit");

// Rate limit requests to prevent exchange rate limiting problems
const apiLimiter = rateLimit(config.rateLimits);
app.use("/", apiLimiter);

app.use(cors())

async function runApi() {

  const poloniex = new Poloniex() 
  const bittrex = new Bittrex()
  const binance = new Binance()
  const hitbtc = new Hitbtc()
  const kraken = new Kraken()
  
  app.get('/combined', async (req, res) => {
    
    const base = req.query.base ? req.query.base : 'BTC'
    const quote = req.query.quote ? req.query.quote : 'ETH'
    
    const combinedOrderBook = await getCombinedOrderBook(base, quote, [bittrex, poloniex, binance, hitbtc, kraken])
    
    return res.send(combinedOrderBook)
  })

  // returns all symbols with supported BTC based order books
  app.get('/symbols', async (req, res) => {
    const supportedSymbols = await getSuportedSymbols()
    res.send(supportedSymbols)
  })
  
  app.listen(config.port, () => console.log('App listening on port ' + config.port))  
}

runApi()

// pulls down and combines order books from the specified exchanges
async function getCombinedOrderBook(base, quote, exchanges) {
  const orderBookPromises = exchanges.map( (exchange) => exchange.getNormalizedOrderBook(base, quote).catch( (err) => {
    console.log(exchange.name + ' getNormalizedOrderBook() error', err)
  }))
  
  const orderBooks = await Promise.all(orderBookPromises)

  // filter out any that failed
  const filteredOrderBooks = orderBooks.filter( (orderBook) => orderBook !== undefined )
  
  return utils.combineOrderbookData(filteredOrderBooks)
}

// Poloniex is the standard used for all symbols
async function getSuportedSymbols() {
  const poloniexTickerData = await fetch('https://poloniex.com/public?command=returnTicker', { method: 'GET', timeout: config.exchangeApiRequestTimeout }).then(res => res.json())
  const poloniexBtcPairs = Object.keys(poloniexTickerData).filter( (pair) => pair.startsWith('BTC_'))
  const symbols = poloniexBtcPairs.map( (pair) => {
    return pair.slice(4, pair.length)
  })
  
  return symbols
}