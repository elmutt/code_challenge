const assert = require('assert')
const app = require('../index')
const fetch = require('node-fetch')

describe('api testing', function () {

  it('should show that /combined endpoint returns correct values', async function () {
    fetch('http://localhost:3001/combined', { method: 'GET'}).then(res => res.json()).then( (res) => {
      assert(typeof res.bids[0].price === 'string')
      assert(typeof res.bids[0].exchangeQuantities[Object.keys(res.bids[0].exchangeQuantities)[0]] === 'number')
      assert(typeof res.bids[0].combinedOrderCount === 'number')
      assert(typeof res.exchangesIncluded[0] === 'string')
    })
  })

  it('should show that /symbols endpoint returns correct values', async function () {
    fetch('http://localhost:3001/symbols', { method: 'GET'}).then(res => res.json()).then( (res) => {
      assert(typeof res === 'object')
      assert(res.length > 0)
      assert(res.includes('ETH'))
    })
  })

  it('should show that /overlaps endpoint returns correct values', async function () {
    fetch('http://localhost:3001/overlaps', { method: 'GET'}).then(res => res.json()).then( (res) => {
      // it might be empty.  we only know it should return an object correctly
      assert(typeof res === 'object')
    })
  })
  
})
