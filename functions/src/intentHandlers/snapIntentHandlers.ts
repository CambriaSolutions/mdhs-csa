import { snapRoot } from './snap/snapRoot'
import { eligibilityChecker } from './common/eligibilityChecker'
import { mapRoot } from './common/map'
import { pebtRoot } from './common/pebt'

export const snapIntentHandlers = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-pebt-root': pebtRoot,

  // Map
  'snap-map-root': mapRoot('snap')
}