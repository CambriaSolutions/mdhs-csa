import { tanfRoot } from './tanf/tanfRoot.js'
import { eligibilityChecker } from './common/eligibilityChecker.js'
import { tanfApplication } from './tanf/tanfApplication.js'
import { mapRoot } from './common/map.js'
import { pebtRoot } from './common/pebt'

module.exports = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-application': tanfApplication,
  'tanf-pebt-root': pebtRoot,

  // Map
  'tanf-map-root': mapRoot('tanf')
}