const { handleUnhandled, noneOfThese } = require('./intentHandlers/common/categorizeAndPredict.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': handleUnhandled
}