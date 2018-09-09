const BaseExchange = require('./BaseExchange')

module.exports = class Binance extends BaseExchange {
  
  constructor () {
    super('Binance', 'https://api.binance.com')

    this.symbolTranslationList = {
      BCH: 'BCC'
    }
  }
  
  async getNormalizedOrderBook(base, quote) {

    const translatedBase = this.translateSymbol(base)
    const translatedQuote = this.translateSymbol(quote)

    // create the base quote pair in the format expected by this exchange
    const pair = translatedQuote +  translatedBase

    // Max depth is 1000 for binance
    const depth = 1000
    
    // get the full order book
    const orderBookResults = await this._fetch('/api/v1/depth?symbol=' + pair + '&limit=' + depth)

    // normalize the results into a standard format

    const bids = orderBookResults.bids.map( (bid) => { return {quantity: +bid[1], price: +bid[0] } })
    const asks = orderBookResults.asks.map( (ask) => { return {quantity: +ask[1], price: +ask[0] } })


    return {bids, asks, exchange: this.name}
  }
}
