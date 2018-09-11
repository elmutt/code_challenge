const BaseExchange = require('../../exchanges/BaseExchange')
const assert = require('assert')

describe('Base Exchange', function () {

  it('should instantiate a new BaseExchange object correctly', async function () {
    const name = 'testname'
    const baseUrl = 'http://test.com'

    const baseExchange = new BaseExchange(name, baseUrl)
    
    assert(baseExchange.name === name)
    assert(baseExchange.baseUrl === baseUrl)
  })

  it('should that translateSymbol() works correctly', async function () {
    const name = 'testname'
    const baseUrl = 'http://test.com'

    const originalSymbol = 'BCC'
    const translatedSymbol = 'BCH'
    
    const baseExchange = new BaseExchange(name, baseUrl)

    baseExchange.symbolTranslationList = { [originalSymbol]: translatedSymbol}

    assert(baseExchange.translateSymbol(originalSymbol) === translatedSymbol)
  })

  it('should that _fetch works correctly', async function () {
    const name = 'testname'
    const baseUrl = 'https://jsonplaceholder.typicode.com'
    
    const baseExchange = new BaseExchange(name, baseUrl)

    //show that we can turn the object into json and back into an object
    return baseExchange._fetch('/todos/1').then( (res) => {
      assert(typeof JSON.parse(JSON.stringify(res)) === 'object')
    })
    
  })
  

})
