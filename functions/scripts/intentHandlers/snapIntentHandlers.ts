import { snapRoot } from '../../src/intentHandlers/snap/snapRoot'
import { eligibilityChecker } from '../../src/intentHandlers/common/eligibilityChecker'
import { mapRoot } from '../../src/intentHandlers/common/map'
import { pebtRoot } from '../../src/intentHandlers/common/pebt'

export const snapIntentHandlers = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-pebt-root': pebtRoot,

  // Map
  'snap-map-root': mapRoot('snap')
}