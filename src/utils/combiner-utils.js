const config = require('../../config')

module.exports = {
  // combines orderBooks and returns them with a list of the exchanges that were combined
  combineOrderbookData: (orderBooks) => {
    
    const bids = combineSide(orderBooks, 'bids')
    const asks = combineSide(orderBooks, 'asks')
    return {bids, asks, exchangesIncluded: orderBooks.map((orderBook) => orderBook.exchange)}
  },
  
  // exported for testing
  combineSide,
  // exporeted for testing
  combineOrders
}

// combines all orders across all books and puts any orders that have the same price into the same order\
function combineSide(orderBooks, side) {

  if (side !== 'bids' && side !== 'asks') {
    throw new error('Invalid side specified')
  }

  // attach the name of the exchanges to each order
  const allOrders = orderBooks.map((orderBook) => {
    return orderBook[side].map((order) => {
      order.exchange = orderBook.exchange
      return order
    })
  })

  // concatenate all orders from all exchanges into a single array
  const combinedOrders = allOrders.reduce((accumulator, orders) => accumulator.concat(orders), [])

  // sort orders from lowest to highest price
  const sortedOrders = combinedOrders.sort( (a, b) => (a.price < b.price) )

  const combinedPriceOrders = []

  // make a new set of combined orders of the same price.
  for (let i = 0; i < sortedOrders.length; i++) {
    let ordersWithMatchingPrice = []
    // found 2 or more sequential orders with the same price.  short circuit if at end of orders
    if ((i + 1) < sortedOrders.length && sortedOrders[i].price === sortedOrders[i + 1].price) {
      // push the first order
      ordersWithMatchingPrice.push(sortedOrders[i])
      do {
        i++;
        // push the next order
        ordersWithMatchingPrice.push(sortedOrders[i])
        //continue as long as there is a subsequent order with matching price.  short circuit if at end of orders
      } while ((i + 1) < sortedOrders.length && sortedOrders[i].price === sortedOrders[i + 1].price)

      // Combine all of the matching price orders
      const combinedOrder = combineOrders(ordersWithMatchingPrice)
      combinedPriceOrders.push(combinedOrder)
    }
    else {
      // Single orders are passed to combineOrders() to make sure they are in the combineOrders() format
      const combinedOrder = combineOrders([sortedOrders[i]])
      combinedPriceOrders.push(combinedOrder)
    }
  }
  return combinedPriceOrders
}

// combines multiple orders at the same price into a single with info about what portion of orders belongs to each exchange
function combineOrders(orders) {

  // Sanity check that all order prices are the same
  orders.forEach((order) => {
    if (order.price !== orders[0].price) {
      throw new Error('combineOrders prices vary')
    }
  })

  const newOrder = {price: orders[0].price}

  const exchangeQuantities = orders.reduce((accumulator, order) => {
    accumulator[order.exchange] = order.quantity + (accumulator[order.exchange] ? accumulator[order.exchange] : 0)
    return accumulator
  }, {})

  newOrder.exchangeQuantities = exchangeQuantities
  newOrder.combinedOrderCount = orders.length

  return newOrder
}