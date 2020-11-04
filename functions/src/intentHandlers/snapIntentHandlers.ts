import { snapRoot } from './snap/snapRoot.js'
import { eligibilityChecker } from './common/eligibilityChecker.js'
import { mapRoot } from './common/map.js'
import { pebtRoot } from './common/pebt'

export const snapIntentHandlers = {
  'snap-root': snapRoot,
  'snap-eligibilityChecker': eligibilityChecker,
  'snap-pebt-root': pebtRoot,

  // Map
  'snap-map-root': mapRoot('snap')
}