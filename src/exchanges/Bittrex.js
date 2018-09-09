const BaseExchange = require('./BaseExchange')

module.exports = class Bittrex extends BaseExchange {
  
  constructor () {
    super('Bittrex', 'https://bittrex.com')
    this.symbolTranslationList = { } // no translation needed for this exchange
  }
  
  async getNormalizedOrderBook(base, quote) {

    const translatedBase = this.translateSymbol(base)
    const translatedQuote = this.translateSymbol(quote)
    
    // create the base quote pair in the format expected by this exchange
    const pair = translatedBase + '-' + translatedQuote

    // get the full order book
    const orderBookResults = await this._fetch('/api/v1.1/public/getorderbook?market=' + pair + '&type=both')

    // normalize the results into a standard format

    const bids = orderBookResults.result.buy.map( (bid) => { return { quantity: bid.Quantity, price: bid.Rate } })
    const asks = orderBookResults.result.sell.map( (ask) => { return { quantity: ask.Quantity, price: ask.Rate } })
    
    
    return {bids, asks, exchange: this.name}
  }
}
