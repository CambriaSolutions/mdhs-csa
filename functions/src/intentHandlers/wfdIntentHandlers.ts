export const getWfdHandler = async (intentName: string) => {
  switch (intentName) {
    case 'wfd-map-root':
      const { mapRoot } = await import('./common/map')
      return mapRoot('wfd')
    default:
      return null
  }
}