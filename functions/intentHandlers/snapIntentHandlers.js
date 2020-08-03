const { snapRoot } = require('./snap/snapRoot.js')
const { eligibilityChecker } = require('./common/eligibilityChecker.js')
const { snapApplication } = require('./snap/snapApplication.js')
const { mapRoot } = require('./common/map.js')
const { pebtRoot } = require('./common/pebt')

module.exports = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-application': snapApplication,
  'snap-pebt-root': pebtRoot,

  // Map
  'snap-map-root': mapRoot('snap')
}