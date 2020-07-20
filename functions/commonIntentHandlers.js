const { commonFallback, noneOfThese } = require('./intentHandlers/common/commonFallback.js')
const { mapDeliverMap } = require('./intentHandlers/common/map.js')
const { docUpload } = require('./intentHandlers/common/docUpload.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': commonFallback,
  'doc-upload': docUpload,
  'map-deliver-map': mapDeliverMap
}