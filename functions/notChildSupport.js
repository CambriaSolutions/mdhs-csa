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

exports.notChildSupportRoot = async agent => {
  try {
    await agent.add(
      `I’m sorry, I am still learning how to help with other issues. Here are the topics I can help you with.`
    )
    await agent.add(new Suggestion('Common Child Support Requests'))
    await agent.add(new Suggestion('Child Support Appointments'))
    await agent.add(new Suggestion('Child Support Payments'))
    await agent.add(new Suggestion('Employer Assistance with Child Support'))
    await agent.add(new Suggestion('Child Support Case Services'))
    await agent.add(new Suggestion('Child Support Office Locations'))
    await agent.add(new Suggestion('Child Support Policy Manual'))
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-not-child-support-retry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

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
    await mapTypeToIntent(agent)
  } catch (err) {
    console.error(err)
  }
}

const mapTypeToIntent = async agent => {
  const type = await agent.context
    .get('request-type')
    .parameters.childSupportRequestType.toLowerCase()
  console.log(type)
  switch (type) {
    case 'common child support requests':
      await supportRoot(agent)
      break
    case 'child support appointments':
      await apptsRoot(agent)
      break
    case 'child support payments':
      await pmtsGeneralRoot(agent)
      break
    case 'employer assistance with child support':
      await employerRoot(agent)
      break
    case 'child support case services':
      await openCSCRoot(agent)
      break
    case 'child support office locations':
      await mapRoot(agent)
      break
    case 'child support policy manual':
      await caseyHandoff(agent)
      break
    default:
      await startRootConversation(agent)
  }
}
