

module.exports = {

  combineEverything: (orderBooks) => {
    
//    const bids = combineOrderBooks(orderBooks, 'bids')
    const asks = combineOrderBooks(orderBooks, 'asks')
    return { asks }
  },
  
}

// attach the running total volumes for each exchange to each price point.
// Side is either 'bids' or 'asks' because they have slightly different logic
function combineOrderBooks(orderBooks, side) {

  if(side !== 'bids' && side !== 'asks')
  {
    throw new error('Invalid side specified')
  }
  
  // attach the name of the exchanges to each bid price point
  const allOrders = orderBooks.map( (orderBook) => {
    return orderBook[side].map( (order) => {
      order.exchange = orderBook.exchange
      return order
    })
  })

  // exchangeVolumes tracks our running total volume for each exchange as we traverse the price points
  const exchangeVolumes = orderBooks.reduce( (accumulator, orderBook) => {
    accumulator[orderBook.exchange] = 0
    return accumulator
  }, {})

  // combine all the orders and
  const combined = allOrders.reduce( (accumulator, bids) => accumulator.concat(bids), [])

  // Sort. Bids are initially sorted in reverse order so that volume running totals add up correctly
  const combinedSorted = (side === 'asks') ? combined.sort(compare) : combined.sort(compareReversed)

  // attach the running total volumes for each exchange to each price point
  const orders = combinedSorted.map( (order, index) => {
    // add quantity from this price point to the running total volume of the corresponding exchange
    exchangeVolumes[order.exchange] += +order.quantity
    // attach the running total volume for each exchange to this price point
    Object.keys(exchangeVolumes).forEach( (exchange) => {
      order['volume_' + exchange] = exchangeVolumes[exchange]
    })
    // add up the running total volume of all exchanges and attach to this price point
    order.totalVolume = Object.values(exchangeVolumes).reduce( (acc, val) => acc+val)
    return order
  })
  
  // Bids need to be re-sorted in correct order since they were originally sorted in reverse
  return (side === 'asks') ? orders : orders.sort(compare)
}

function compare(a, b) {
  return a.price - b.price
}

function compareReversed(b, a) {
  return a.price - b.price
}
