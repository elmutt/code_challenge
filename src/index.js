const Poloniex = require('./exchanges/Poloniex')
const Bittrex = require('./exchanges/Bittrex')
const Binance = require('./exchanges/Binance')
const Hitbtc = require('./exchanges/Hitbtc')
const Kraken = require('./exchanges/Kraken')
const config = require('../config')
const utils = require('./utils/utils')
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
  
  // returns combined orders for the specified base-quote orderbook
  app.get('/combined', async (req, res) => {

    const base = req.query.base ? req.query.base : config.defaultBase
    const quote = req.query.quote ? req.query.quote : config.defaultQuote
    const precision = req.query.precision ? req.query.precision : config.pricePrecision
    
    const combinedOrderBook = await utils.getCombinedOrderBook(base, quote, [bittrex, poloniex, binance, hitbtc, kraken], precision)
    
    return res.send(combinedOrderBook)
  })

  // returns all BTC based symbols from poloniex.  We use this as our list of "quote" coins to choose from
  app.get('/symbols', async (req, res) => {

    const supportedSymbols = await utils.getSuportedSymbols()

    res.send(supportedSymbols)
  })

  // returns any orders that overlap across exchanges.
  app.get('/overlaps', async (req, res) => {

    const base = req.query.base ? req.query.base : config.defaultBase
    const quote = req.query.quote ? req.query.quote : config.defaultQuote

    const overlaps = await utils.detectOverlap(base, quote, [bittrex, poloniex, binance, hitbtc, kraken])
    
    return res.send(overlaps)
  })

  
  
  app.listen(config.port, () => console.log('App listening on port ' + config.port))  
}

runApi()