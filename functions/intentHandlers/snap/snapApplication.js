const { handleEndConversation } = require('../globalFunctions')

exports.snapApplication = async agent => {
  try {
    const link = '<a href="https://www.access.ms.gov/Application" target="_blank">click here</a>'
    await agent.add(
      'SNAP, formerly known as the food stamp program, provides monthly benefits that \
      help low income households buy the food they need for good health.'
    )
    await agent.add(`Please ${link} to start a new SNAP application.`)
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}