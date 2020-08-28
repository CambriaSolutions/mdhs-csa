const { tanfRoot } = require('./tanf/tanfRoot.js')
const { eligibilityChecker } = require('./common/eligibilityChecker.js')
const { tanfApplication } = require('./tanf/tanfApplication.js')
const { mapRoot } = require('./common/map.js')
const { pebtRoot } = require('./common/pebt')

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-application': tanfApplication,
  'tanf-pebt-root': pebtRoot,

  // Map
  'tanf-map-root': mapRoot('tanf')
}