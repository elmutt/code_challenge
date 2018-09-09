
const fetch = require('node-fetch')
const config = require('../../config.js')


module.exports = class BaseExchange {
  
  constructor (name, baseUrl) {
    this.name = name
    this.baseUrl = baseUrl
    this.symbolTranslationList = {}
  }
  
  translateSymbol (symbol) {
    return this.symbolTranslationList[symbol] || symbol
  }

  async _fetch (url) {
    return fetch(this.baseUrl + url, { method: 'GET', timeout: config.exchangeApiRequestTimeout }).then(res => res.json())
  }
}
