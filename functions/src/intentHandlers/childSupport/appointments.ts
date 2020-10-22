import { handleEndConversation } from '../globalFunctions'

export const apptsOfficeLocationsHandoff = async agent => {
  try {
    const { mapRoot } = await import('../common/map.js')

    const wantsLocation = agent.parameters.wantsLocation
    if (wantsLocation === 'yes') {
      await mapRoot('cse')(agent)
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.log(err)
  }
}