
module.exports = {
  exchangeApiRequestTimeout: 10000, // exchanges must respond within 10 seconds
  rateLimits: {
    windowMs: 5 * 1000, // 5 seconds
    max: 1
  },
  pricePrecision: 4
}