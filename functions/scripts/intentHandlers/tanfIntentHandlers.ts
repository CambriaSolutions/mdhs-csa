import { tanfRoot } from '../../src/intentHandlers/tanf/tanfRoot'
import { eligibilityChecker } from '../../src/intentHandlers/common/eligibilityChecker'
import { mapRoot } from '../../src/intentHandlers/common/map'
import { pebtRoot } from '../../src/intentHandlers/common/pebt'

export const tanfIntentHandlers = {
  'tanf-root': tanfRoot,
  'tanf-eligibilityChecker': eligibilityChecker,
  'tanf-pebt-root': pebtRoot,

  // Map
  'tanf-map-root': mapRoot('tanf')
}