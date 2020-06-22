const { tanfRoot } = require('./intentHandlers/tanf/tanfRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')
const { tanfApplication } = require('./intentHandlers/tanf/tanfApplication.js')

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-application': tanfApplication
}