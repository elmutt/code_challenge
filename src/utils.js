
const config = require('../config')

module.exports = {

  combineOrderbookData: (orderBooks) => {
    const bids = combineSide(orderBooks, 'bids')
    const asks = combineSide(orderBooks, 'asks')
    return {bids, asks, exchangesIncluded: orderBooks.map((orderBook) => orderBook.exchange)}
  },

  // TODO finish this.  make it not dependent on the precision specified on the front end (use 8 digits). 
// TODO Then write unit tests and clean everything up and put online!!!
  detectOverlap: (orderBooks) => {
    const overlaps = []
    for (let i = 0; i < orderBooks.length - 1; i++) {
      for (let j = i + 1; j < orderBooks.length; j++) {
        const bidsBook1 = orderBooks[i].bids
        const asksBook1 = orderBooks[i].asks
        const exchange1 = orderBooks[i].exchange

        const asksBook2 = orderBooks[j].asks
        const bidsBook2 = orderBooks[j].bids
        const exchange2 = orderBooks[j].exchange
        
        // TODO reverse the comapre symbols here so it works correctly
        if(+bidsBook1[0].price > +asksBook2[0].price) {
          overlaps.push({bid: bidsBook1[0], ask: asksBook2[0], bidExchange: exchange1, askExchange: exchange2})
        }
        if(+asksBook1[0].price < +bidsBook2[0].price) {
          overlaps.push({ask: asksBook1[0], bid: bidsBook2[0], bidExchange: exchange2, askExchange: exchange1})
        }
        
      }
    }
    return overlaps
  }
}


// combines all orders across all books and puts any orders that have the same price into the same order
function combineSide(orderBooks, side) {

  if(side !== 'bids' && side !== 'asks')
  {
    throw new error('Invalid side specified')
  }
  
  // attach the name of the exchanges to each order
  const allOrders = orderBooks.map( (orderBook) => {
    return orderBook[side].map( (order) => {
      order.exchange = orderBook.exchange
      return order
    })
  })
  
  // concatenate all orders from all exchanges into a single array
  const combinedOrders = allOrders.reduce( (accumulator, orders) => accumulator.concat(orders), [])
  
  const sortedOrders = combinedOrders.sort(compare)
  
  const combinedPriceOrders = []

  // make a new set of orders that combine any orders with identical prices
  // TODO triple check this logic and test it real good
  for(let i=0;i<sortedOrders.length;i++) {
    let ordersWithMatchingPrice = []
    // found 2 or more sequential orders with the same price.  short circuit if at end of orders
    if( (i + 1) < sortedOrders.length && sortedOrders[i].price === sortedOrders[i + 1].price ) {
      // push the first order
      ordersWithMatchingPrice.push(sortedOrders[i])
      do {
        i++;
        // push the next order
        ordersWithMatchingPrice.push(sortedOrders[i])
        //continue as long as there is a subsequent order with matching price.  short circuit if at end of orders
      } while( (i + 1) < sortedOrders.length && sortedOrders[i].price === sortedOrders[i + 1].price)
      
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

function compare(a, b) {
  return a.price - b.price
}

// combines multiple orders at the same price into a single with info about what proportion of this order belongs to each exchange
function combineOrders(orders) {
  
  // Sanity check that all order prices are the same
  orders.forEach( (order) => {
    if(order.price !== orders[0].price) {
      throw new Error('combineOrders prices vary')
    }
  })
  
  const newOrder = {price: orders[0].price}

  const exchangeQuantities = orders.reduce( (accumulator, order) => {
    accumulator[order.exchange] = order.quantity +  (accumulator[order.exchange] ? accumulator[order.exchange]  : 0)
    return accumulator
  }, {})
  
  newOrder.exchangeQuantities = exchangeQuantities
  newOrder.combinedOrderCount = orders.length
  
  return newOrder
}