
module.exports = {
  exchangeApiRequestTimeout: 10000, // exchanges must respond within 10 seconds
  rateLimits: {
    windowMs: 10 * 1000, // 5 seconds
    max: 10
  },
  pricePrecision: 4,
  port: 3001,
  defaultBase: 'BTC',
  defaultQuote: 'ETH',
  
}