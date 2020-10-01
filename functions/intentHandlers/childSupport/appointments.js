const Logger = require('../../utils/Logger')
const logger = new Logger('Appointments')
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
    logger.error(err.message, err)
  }
}