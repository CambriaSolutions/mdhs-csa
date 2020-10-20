const { handleEndConversation } = require('../globalFunctions')

exports.apptsOfficeLocationsHandoff = async agent => {
  try {
    const { mapRoot } = require('../common/map.js')

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