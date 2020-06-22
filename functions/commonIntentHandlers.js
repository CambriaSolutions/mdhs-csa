const { commonFallback, noneOfThese } = require('./intentHandlers/common/commonFallback.js')
const { mapRoot, mapDeliverMap } = require('./intentHandlers/common/map.js')
const { docUpload } = require('./intentHandlers/common/docUpload.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': commonFallback,
  'doc-upload': docUpload,
  'map-root': mapRoot,
  'map-deliver-map': mapDeliverMap
}