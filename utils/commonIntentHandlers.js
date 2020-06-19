const { commonFallback, noneOfThese } = require('../intentHandlers/common/commonFallback.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': commonFallback
}