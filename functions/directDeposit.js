const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')
const isNumber = require('lodash/isNumber')
const { handleEndConversation } = require('./globalFunctions.js')

exports.dirDepRoot = async agent => {
  try {
    await agent.add(
      `I can help you with finding the Authorization Agreement for Direct Deposit! What would you like to do?`
    )
    await agent.add(new Suggestion('Learn More'))
    await agent.add(new Suggestion('Go to Form'))
    await agent.context.set({
      name: 'waiting-dirDep-learn-more',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-confirm-form',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepConfirmForm = async agent => {
  try {
    await agent.add(
      `I want to help you make sure that you fill out the form correctly. Before proceding, we recommend you get a little more informed about the Direct Deposit form. Would you like to do that?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No, take me to the form'))
    await agent.context.set({
      name: 'waiting-dirDep-learn-more',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-show-form',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepShowForm = async agent => {
  try {
    await agent.add(
      `Here is the link to the direct deposit form [url], let me know if you have any questions!`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepLearnMore = async agent => {
  try {
    await agent.add(`Which would you like to do?`)
    await agent.add(new Suggestion('Start'))
    await agent.add(new Suggestion('Change'))
    await agent.add(new Suggestion('Stop/Terminate'))
    await agent.context.set({
      name: 'waiting-dirDep-start',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-change',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-stop',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}
