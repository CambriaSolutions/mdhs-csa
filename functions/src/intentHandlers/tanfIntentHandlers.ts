export const getTanfHandler = async (intentName: string) => {
  switch (intentName) {
    case 'tanf-root':
      const { tanfRoot } = await import('./tanf/tanfRoot')
      return tanfRoot
    case 'tanf-eligibilityChecker':
      const { eligibilityChecker } = await import('./common/eligibilityChecker')
      return eligibilityChecker
    case 'tanf-pebt-root':
      const { pebtRoot } = await import('./common/pebt')
      return pebtRoot
    case 'tanf-map-root':
      const { mapRoot } = await import('./common/map')
      return mapRoot('tanf')
    default:
      return null
  }
}