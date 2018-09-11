
module.exports = {
  // exchanges must respond within 10 seconds
  exchangeApiRequestTimeout: 10000,
  rateLimits: {    
    // 10 requests per 10 seconds
    windowMs: 10 * 1000,
    max: 10
  },
  // Exchanges usually have 8 decimal places by default but this rarely results in orders being combined because the prices dont match.  
  // Reduce precision to combine more orders
  pricePrecision: 4,
  port: 3001,
  
  // default base and quote symbols of order books to combine
  defaultBase: 'BTC',
  defaultQuote: 'ETH',
  
}