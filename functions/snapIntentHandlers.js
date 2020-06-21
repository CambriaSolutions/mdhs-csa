const { snapRoot } = require('./intentHandlers/snap/snapRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')

module.exports = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker
}