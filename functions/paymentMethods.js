const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')

exports.pmtMethodsRoot = async agent => {
  try {
    await agent.add(
      `I can help help with determining payment options. Which of the following roles applies to you?`
    )
    await agent.add(new Suggestion('Custodial Parent'))
    await agent.add(new Suggestion('Non-Custodial Parent'))
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('None of These'))
    await agent.context.set({
      name: 'waiting-pmtMethods-custodial',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-nonCustodial',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-employer',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-none',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCustodial = async agent => {
  try {
    await agent.add(`Payments for custodial parents go through EPPICard.`)
    await agent.add(
      `Visit their website here [url] for call their support line at 1-866-461-4095.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}
