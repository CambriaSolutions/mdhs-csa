const { tanfRoot } = require('./intentHandlers/tanf/tanfRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker
}