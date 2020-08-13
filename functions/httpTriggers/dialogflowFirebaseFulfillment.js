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
const storeAnalytics = require('./storeAnalytics')
const { subjectMatterLocations } = require('../constants/constants.js')
const { getTextResponses, getSuggestions, genericHandler } = require('../utils/fulfillmentMessages.js')

const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined) {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
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
    [intentName]: () => {
      const dialogflowTextResponses = getTextResponses(request.body.queryResult.fulfillmentMessages)
      const dialogflowSuggestions = getSuggestions(request.body.queryResult.fulfillmentMessages)

      genericHandler(agent, dialogflowTextResponses, dialogflowSuggestions)
    },
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

  // Check to see if we need to override the target intent
  // In case of Home and Go Back this may be needed during parameter entry.
  if (isActionRequested(request.body, 'Home') && agent.context.get('waiting-global-restart') !== undefined) {
    agent.intent = 'global-restart'
  } else if (isActionRequested(request.body, 'Go Back') && agent.context.get('waiting-go-back') !== undefined) {
    agent.intent = 'go-back'
  }

  await backIntent(agent, intentHandlers, resetBackIntentList, 'go-back', request.body.queryResult.fulfillmentMessages)
  await home(agent, intentHandlers, resetHomeIntentList)

  await agent.handleRequest(new Map(Object.entries(intentHandlers)))
  await storeAnalytics(request.body)
}