const { Suggestion } = require('dialogflow-fulfillment')
const { disableInput } = require('../../../common/intentHandlers/disableInput.js')
const { handleEndConversation } = require('../../../common/intentHandlers/handleEndConversation.js')
const { tbd } = require('../../../common/intentHandlers/tbd.js')

const { formatCurrency } = require('../../../common/util/formatCurrency.js.js')
const { toTitleCase } = require('../../../common/util/toTitleCase.js')
const { calculatePercentage } = require('../../../common/util/calculatePercentage.js.js')
const { validateCaseNumber } = require('../../../common/util/validateCaseNumber.js.js')

// Format description text for Support Requests
exports.formatDescriptionText = supportType => {
  let descriptionText
  if (supportType === 'request contempt action') {
    descriptionText =
      'Please describe your request for assistance regarding your Request for Contempt Action.'
  } else if (supportType === 'child support increase or decrease') {
    descriptionText =
      'Please describe your request for review of your child support payments.'
  } else if (supportType === 'change personal information') {
    descriptionText =
      'Please share with me the changes to your personal information. I can record changes that apply for the parent who pays or receives child support.'
  } else if (supportType === 'request payment history or record') {
    descriptionText =
      'What do you need exactly regarding payment history or payment records?'
  } else if (
    supportType === 'report information about the parent who pays support'
  ) {
    descriptionText = `What information do you want to share regarding the parent who pays child support? Helpful information includes this parent's address and phone number, employer information, asset information or information about this parent's ability to work.`
  } else if (supportType === 'request case closure') {
    descriptionText =
      'What information do you want to share regarding your request for case closure?'
  } else if (supportType === 'add authorized user') {
    descriptionText =
      'Please tell us the name and relationship of the person you are authorizing.'
  } else {
    descriptionText = 'Please describe your request.'
  }
  return descriptionText
}

// Handle startOfConversation
exports.startRootConversation = async agent => {
  try {
    await agent.add(`What can I help you with?`)
    await agent.add(new Suggestion('Common Requests'))
    await agent.add(new Suggestion('Appointments'))
    await agent.add(new Suggestion('Payments'))
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('Opening a Child Support Case'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.add(new Suggestion('Policy Manual'))
    await agent.add(new Suggestion('Stimulus Check'))
    await agent.add(new Suggestion(`Visitation`))
    await agent.add(new Suggestion('Enforcement Action'))
  } catch (err) {
    console.error(err)
  }
}

// Directs the user to Casey
exports.caseyHandoff = async agent => {
  try {
    await agent.add(
      `Click <a href="https://mdhs-policysearch.cambriasolutionssc.com" target="_blank">Here</a> to search the Child Support Policy Manual`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

// Persisting the imports below in this location because too many handlers are currently referencing them.
exports.disableInput = disableInput
exports.handleEndConversation = handleEndConversation
exports.tbd = tbd
exports.formatCurrency = formatCurrency
exports.toTitleCase = toTitleCase
exports.calculatePercentage = calculatePercentage
exports.validateCaseNumber = validateCaseNumber