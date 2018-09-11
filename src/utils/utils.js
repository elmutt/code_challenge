
const config = require('../../config')
const combinerUtils = require('./combiner-utils')
const fetch = require('node-fetch')

module.exports = {
  
  // detects any overlap (arbitrage opportunity) from the specified exchanges for the specified base and quote symbols.
   detectOverlap: async (base, quote, exchanges) => {
     const orderBooks = await getOrderBooks(base, quote, exchanges, 8) // highest possible precision is used to better detect price overlap

     const overlaps = []
     for (let i = 0; i < orderBooks.length - 1; i++) {
       for (let j = i + 1; j < orderBooks.length; j++) {
         const bidsBook1 = orderBooks[i].bids
         const asksBook1 = orderBooks[i].asks
         const exchange1 = orderBooks[i].exchange

         const asksBook2 = orderBooks[j].asks
         const bidsBook2 = orderBooks[j].bids
         const exchange2 = orderBooks[j].exchange

         if(+bidsBook1[0].price > +asksBook2[0].price) {
           overlaps.push({bid: bidsBook1[0], ask: asksBook2[0], bidExchange: exchange1, askExchange: exchange2})
         }
         if(+asksBook1[0].price < +bidsBook2[0].price) {
           overlaps.push({ask: asksBook1[0], bid: bidsBook2[0], bidExchange: exchange2, askExchange: exchange1})
         }

       }
     }
     
     return overlaps
  },
  
  // attempts to pull down and combines order books from the specified exchanges for the specified base and quote symbols.
  getCombinedOrderBook: async (base, quote, exchanges, precision) => {
    const orderBooks = await getOrderBooks(base, quote, exchanges, precision)
    return combinerUtils.combineOrderbookData(orderBooks)
  },

  // Get all supported symbols for the quote side of order books
  // Poloniex is the standard used for all symbols
  getSuportedSymbols: async () => {
    const poloniexTickerData = await fetch('https://poloniex.com/public?command=returnTicker', { method: 'GET', timeout: config.exchangeApiRequestTimeout }).then(res => res.json())
    const poloniexBtcPairs = Object.keys(poloniexTickerData).filter( (pair) => pair.startsWith('BTC_'))
    const symbols = poloniexBtcPairs.map( (pair) => {
      return pair.slice(4, pair.length)
    })

    return symbols
  },
  
  // exporting for testing
  getOrderBooks
}

// gets order books of base-quote from the specified exchanges at the specified precision.  discards any that fail.
async function getOrderBooks(base, quote, exchanges, precision) {
  const orderBookPromises = exchanges.map( (exchange) => exchange.getNormalizedOrderBook(base, quote, precision).catch( (err) => {
    // catch this error so one exchange failing doesnt cause problems
  }))
  const orderBooks = await Promise.all(orderBookPromises)
  // filter out any that failed
  return orderBooks.filter( (orderBook) => orderBook !== undefined )
}
