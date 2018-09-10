const BaseExchange = require('./BaseExchange')
const config = require('../../config')

module.exports = class Poloniex extends BaseExchange {
  
  constructor () {
    super('Poloniex', 'https://poloniex.com')
    this.symbolTranslationList = { } // no translation needed for this exchange
  }
  
  async getNormalizedOrderBook(base, quote, precision) {
    
    const translatedBase = this.translateSymbol(base)
    const translatedQuote = this.translateSymbol(quote)

    // create the base quote pair in the format expected by this exchange
    const pair = translatedBase + '_' + translatedQuote

    // There is no way to specify full order depth for poloniex.  1 billion should easily cover everything
    const depth = 1000000000
    
    // get the full order book
    const orderBookResults = await this._fetch('/public?command=returnOrderBook&currencyPair=' + pair + '&depth=' + depth)

    // normalize the results into a standard format
    const bids = orderBookResults.bids.map( (bid) => { return {quantity: +bid[1], price: (+bid[0]).toFixed(precision) } })
    const asks = orderBookResults.asks.map( (ask) => { return {quantity: +ask[1], price: (+ask[0]).toFixed(precision) } })
    
    return {bids, asks, exchange: this.name}    
  }
}
