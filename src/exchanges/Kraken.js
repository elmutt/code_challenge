const BaseExchange = require('./BaseExchange')
const config = require('../../config')

module.exports = class Kraken extends BaseExchange {

  constructor () {
    super('Kraken', 'https://api.kraken.com')
    this.symbolTranslationList = {

      ETC: 'XETC',
      ETH: 'XETH',
      ICN: 'XICN',
      LTC: 'XLTC',
      MLN: 'XMLN',
      REP: 'XREP',
      DOGE: 'XXDG',
      XLM: 'XXLM',
      XMR: 'XXMR',
      XRP: 'XXRP',
      ZEC: 'XZEC',
      BTC: 'XXBT'
    }
  }

  async getNormalizedOrderBook(base, quote, precision) {

    const translatedBase = this.translateSymbol(base)
    const translatedQuote = this.translateSymbol(quote)

    // create the base quote pair in the format expected by this exchange
    const pair = translatedQuote + translatedBase

    // There is no way to specify full order depth for kraken.  1 billion should easily cover everything
    const depth = 1000000000

    // get the full order book
    const orderBookResults = await this._fetch('/0/public/Depth?pair=XETHXXBT&count=' + depth)
    
    const bids = orderBookResults.result[pair].bids.map( (bid) => { return {quantity: +bid[1], price: (+bid[0]).toFixed(precision) } })
    const asks = orderBookResults.result[pair].asks.map( (ask) => { return {quantity: +ask[1], price: (+ask[0]).toFixed(precision) } })

    return {bids, asks, exchange: this.name}
  }
}
