exports.emancipationAge = async agent => {
  try {
    const { handleEndConversation } = require('../globalFunctions')

    await agent.add(
      'The age of emancipation is 21 years old in MS. For other states, ages may vary. Click <a href="https://www.acf.hhs.gov/css/irg-state-map" target="_blank">here</a> for emancipation information from other states.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
