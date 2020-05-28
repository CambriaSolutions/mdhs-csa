const { Suggestion } = require('dialogflow-fulfillment')

exports.yesChildSupport = async agent => {
  try {
    await agent.add(
      `Great! I can assist you by providing general information about the child support program or by directing common child support requests to the appropriate MDHS team for handling. The information I provide is not legal advice. MDHS does not provide legal representation. Also, please do not enter SSN or DOB in at any time during your conversations.`
    )
    await agent.add(
      `By clicking "I Acknowledge" below you are acknowledging receipt and understanding of these statements and the MDHS Website Disclaimers, Terms, and Conditions found <a href="https://www.mdhs.ms.gov/privacy-disclaimer/" target="_blank">here</a>, and that you wish to continue.`
    )
    await agent.add(new Suggestion('I Acknowledge'))
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-acknowledge-privacy-statement',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}