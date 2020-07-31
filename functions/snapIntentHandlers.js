const { snapRoot } = require('./intentHandlers/snap/snapRoot.js')
const { eligibilityChecker } = require('./intentHandlers/common/eligibilityChecker.js')
const { snapApplication } = require('./intentHandlers/snap/snapApplication.js')
const { mapRoot } = require('./intentHandlers/common/map.js')
const { pebtRoot } = require('./intentHandlers/common/pebt')

module.exports = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-application': snapApplication,
  'snap-pebt-root': pebtRoot,

  // Map
  'snap-map-root': mapRoot('snap')
}