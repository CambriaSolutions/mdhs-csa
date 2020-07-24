const { tanfRoot } = require('./intentHandlers/tanf/tanfRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')
const { tanfApplication } = require('./intentHandlers/tanf/tanfApplication.js')
const { mapRoot } = require('./intentHandlers/common/map.js')

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-application': tanfApplication,

  // Map
  'tanf-map-root': mapRoot('tanf')
}