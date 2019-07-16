const { Suggestion } = require('dialogflow-fulfillment')
const {
  startRootConversation,
  disableInput,
  caseyHandoff,
} = require('./globalFunctions.js')

const { apptsRoot } = require('./appointments.js')
const { employerRoot } = require('./employer.js')
const { mapRoot } = require('./map.js')
const { openCSCRoot } = require('./openChildSupportCase.js')
const { pmtsGeneralRoot } = require('./paymentsGeneral.js')
const { supportRoot } = require('./support.js')

// User has stated that they are not here for child support
exports.notChildSupportRoot = async agent => {
  try {
    await agent.add(
      `I’m sorry, I am still learning how to help with other issues. Here are the topics I can help you with relating to **Child Support (CS)**:`
    )
    await agent.add(new Suggestion('Common CS Requests'))
    await agent.add(new Suggestion('CS Appointments'))
    await agent.add(new Suggestion('CS Payments'))
    await agent.add(new Suggestion('Employer Assistance with CS'))
    await agent.add(new Suggestion('CS Case Services'))
    await agent.add(new Suggestion('CS Office Locations'))
    await agent.add(new Suggestion('CS Policy Manual'))
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-not-child-support-retry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

// Store the request type from the retry above and force acknowledgement
exports.handleChildSupportRetry = async agent => {
  const childSupportRequestType = agent.parameters.childSupportRequests
  try {
    await agent.add(
      `Great! I can assist you by providing general information about the child support program or by directing common child support requests to the appropriate MDHS team for handling. The information I provide is not legal advice. MDHS does not provide legal representation. Also, please do not enter SSN or DOB in at any time during your conversations.`
    )
    await agent.add(
      `By clicking "I Acknowledge" below you are acknowledging receipt and understanding of these statements and that you wish to continue.`
    )
    await agent.add(new Suggestion('I Acknowledge'))
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-acknowlegement-after-retry',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'request-type',
      parameters: { childSupportRequestType },
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.handleAcknowledgementAfterRetry = async agent => {
  try {
    await mapRequestTypeToIntent(agent)
  } catch (err) {
    console.error(err)
  }
}

// Retrieve the request type from context and map to appropriate intent
const mapRequestTypeToIntent = async agent => {
  const type = await agent.context
    .get('request-type')
    .parameters.childSupportRequestType.toLowerCase()
  switch (type) {
    case 'common cs requests':
      await supportRoot(agent)
      break
    case 'cs appointments':
      await apptsRoot(agent)
      break
    case 'cs payments':
      await pmtsGeneralRoot(agent)
      break
    case 'employer assistance with cs':
      await employerRoot(agent)
      break
    case 'cs case services':
      await openCSCRoot(agent)
      break
    case 'cs office locations':
      await mapRoot(agent)
      break
    case 'cs policy manual':
      await caseyHandoff(agent)
      break
    default:
      await startRootConversation(agent)
  }
}
