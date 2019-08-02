const { handleEndConversation } = require('./globalFunctions.js')

exports.geneticTestingRequest = async agent => {
  try {
    await agent.add(
      `Genetic testing is available as part of MDHS full services. There is a $25 fee to apply for full services, and if you are a parent responsible for paying support, you may also be responsible for paying the costs of genetic testing.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.geneticTestingResults = async agent => {
  try {
    await agent.add(
      `Generally, the Genetic test results are completed within 14 days of all parties completing the swab.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
