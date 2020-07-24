const { tanfRoot } = require('./intentHandlers/tanf/tanfRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')
const { tanfApplication } = require('./intentHandlers/tanf/tanfApplication.js')
const { mapRoot } = require('./intentHandlers/common/map.js')
const { pebtRoot } = require('./intentHandlers/common/pebt')

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-application': tanfApplication,
  'tanf-pebt-root': pebtRoot,

  // Map
  'tanf-map-root': mapRoot('tanf')
}