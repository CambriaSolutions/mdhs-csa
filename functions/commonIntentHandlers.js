const { commonFallback, noneOfThese } = require('./intentHandlers/common/commonFallback.js')
const { mapRoot, mapDeliverMap } = require('./intentHandlers/common/map.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': commonFallback,
  'map-root': mapRoot,
  'map-deliver-map': mapDeliverMap
}