const { handleUnhandled, noneOfThese } = require('./intentHandlers/common/categorizeAndPredict.js')
const { mapRoot, mapDeliverMap } = require('./intentHandlers/common/map.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': handleUnhandled,
  'map-root': mapRoot,
  'map-deliver-map': mapDeliverMap,
}