export const getSnapHandler = async (intentName: string) => {
  switch (intentName) {
    case 'snap-root':
      const { snapRoot } = await import('./snap/snapRoot')
      return snapRoot
    case 'snap-eligibilityChecker':
      const { eligibilityChecker } = await import('./common/eligibilityChecker')
      return eligibilityChecker
    case 'snap-pebt-root':
      const { pebtRoot } = await import('./common/pebt')
      return pebtRoot
    case 'snap-map-root':
      const { mapRoot } = await import('./common/map')
      return mapRoot('snap')
    default:
      return null
  }
}