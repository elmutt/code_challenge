const BaseExchange = require('./BaseExchange')
const config = require('../../config')

module.exports = class Hitbtc extends BaseExchange {

  constructor () {
    super('Hitbtc', 'https://api.hitbtc.com')
    this.symbolTranslationList = { } // no translation needed for this exchange
  }

  async getNormalizedOrderBook(base, quote, precision) {

    const translatedBase = this.translateSymbol(base)
    const translatedQuote = this.translateSymbol(quote)

    // create the base quote pair in the format expected by this exchange
    const pair = translatedQuote +  translatedBase

    // get the full order book
    const orderBookResults = await this._fetch('/api/2/public/orderbook/' + pair + '?limit=0')

    // normalize the results into a standard format

    const bids = orderBookResults.bid.map( (bid) => { return { quantity: +bid.size, price: (+bid.price).toFixed(precision) } })
    const asks = orderBookResults.ask.map( (ask) => { return { quantity: +ask.size, price: (+ask.price).toFixed(precision) } })

    return {bids, asks, exchange: this.name}
  }
}
