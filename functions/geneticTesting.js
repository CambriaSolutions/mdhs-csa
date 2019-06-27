const { handleEndConversation } = require('./globalFunctions.js')

exports.geneticTestingRequest = async agent => {
  try {
    await agent.add(
      `Genetic testing is available as part of MDHS full services. Full services require a payment of $35.00.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.geneticTestingResults = async agent => {
  try {
    await agent.add(
      `Generally, within 14 days of all parties completing the swab.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
