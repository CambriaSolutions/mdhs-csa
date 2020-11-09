import { tanfRoot } from './tanf/tanfRoot'
import { eligibilityChecker } from './common/eligibilityChecker'
import { mapRoot } from './common/map'
import { pebtRoot } from './common/pebt'

export const tanfIntentHandlers = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-pebt-root': pebtRoot,

  // Map
  'tanf-map-root': mapRoot('tanf')
}