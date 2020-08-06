const { WebhookClient } = require('dialogflow-fulfillment')
const backIntent = require('../intentHandlers/back')
const home = require('../intentHandlers/home')
const globalIntentHandlers = require('../intentHandlers/globalIntentHandlers')
const commonIntentHandlers = require('../intentHandlers/commonIntentHandlers')
const childSupportIntentHandlers = require('../intentHandlers/childSupportIntentHandlers')
const tanfIntentHandlers = require('../intentHandlers/tanfIntentHandlers')
const snapIntentHandlers = require('../intentHandlers/snapIntentHandlers')
const wfdIntentHandlers = require('../intentHandlers/wfdIntentHandlers')
const { mapDeliverMap } = require('../intentHandlers/common/map.js')
const getSubjectMatter = require('../utils/getSubjectMatter.js')
const _ = require('lodash')
const { Suggestion } = require('dialogflow-fulfillment')
const storeAnalytics = require('./storeAnalytics')
const { subjectMatterLocations } = require('../constants/constants.js')

const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined) {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
}

// If a request comes in with responses set in dialogflow, or a custom payload specifying
// which suggestions to include, this function will handle it.
const dialogflowResponsesAndCustomPayloadHandler = (fulfillmentMessage, agent) => {
  // There might be multiple text objects in the fulfillmentMessage array, but every object will always have one 
  // text object inside of it, will only one string in the array, hence we always look at index 0
  const textResponses = _.map(_.filter(fulfillmentMessage, f => f.text), x => x.text.text[0])

  if (textResponses) {
    _.forEach(textResponses, text => {
      if (text) { agent.add(text) }
    })
  }

  // There should only ever be one payload object in the fulfillmentMessage object
  const customPayload = _.find(fulfillmentMessage, x => x.payload) ? _.find(fulfillmentMessage, x => x.payload).payload : null

  const suggestions = customPayload ? customPayload.suggestions : []

  _.forEach(suggestions, x => agent.add(new Suggestion(x)))
}

module.exports = async (request, response) => {
  console.log(
    'Dialogflow Request headers: ' + JSON.stringify(request.headers)
  )

  console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

  if (request.body.queryResult.fulfillmentMessages) {
    // If request contains a custom payload, it is necessary that each object in the fulfillmentMessages array
    // include a "platform" property. Must happen before instantiating the WebhookClient
    request.body.queryResult.fulfillmentMessages = request.body.queryResult.fulfillmentMessages.map(m => ({
      ...m,
      platform: m.platform ? m.platform : 'PLATFORM_UNSPECIFIED'
    }))
  }

  const agent = new WebhookClient({ request, response })

  const subjectMatter = getSubjectMatter(agent)

  const intentName = request.body.queryResult.intent.displayName

  let intentHandlers = {
    // The current intent always needs a handler, so we create a default placeholder
    // If the intent has an actual handler, the default will be overwritten by the proceeding
    // spread objects
    [intentName]: () => { },
    ...globalIntentHandlers,
    ...commonIntentHandlers,
    ...childSupportIntentHandlers,
    ...tanfIntentHandlers,
    ...snapIntentHandlers,
    ...wfdIntentHandlers,
    'map-deliver-map': mapDeliverMap(subjectMatterLocations[subjectMatter])
  }

  // List of intents what will reset the back button context
  const resetBackIntentList = [
    'Default Welcome Intent',
    'cse-support-submit-issue',
  ]

  const resetHomeIntentList = [
    'Default Welcome Intent',
    'restart-conversation',
    'global-restart',
    'acknowledge-privacy-statement'
  ]

  dialogflowResponsesAndCustomPayloadHandler(request.body.queryResult.fulfillmentMessages, agent)

  // Check to see if we need to override the target intent
  // In case of Home and Go Back this may be needed during parameter entry.
  if (isActionRequested(request.body, 'Home') && agent.context.get('waiting-global-restart') !== undefined) {
    agent.intent = 'global-restart'
  } else if (isActionRequested(request.body, 'Go Back') && agent.context.get('waiting-go-back') !== undefined) {
    agent.intent = 'go-back'
  }

  await backIntent(agent, intentHandlers, resetBackIntentList)
  await home(agent, intentHandlers, resetHomeIntentList)

  await agent.handleRequest(new Map(Object.entries(intentHandlers)))
  await storeAnalytics(request.body)
}