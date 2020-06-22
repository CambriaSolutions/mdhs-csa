const { snapRoot } = require('./intentHandlers/snap/snapRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')
const { snapApplication } = require('./intentHandlers/snap/snapApplication.js')

module.exports = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-application': snapApplication
}