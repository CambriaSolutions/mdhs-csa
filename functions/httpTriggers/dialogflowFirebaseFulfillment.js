const admin = require('firebase-admin')
const db = admin.firestore()

const { WebhookClient } = require('dialogflow-fulfillment')
const backIntent = require('../intentHandlers/back')
const home = require('../intentHandlers/home')
const handleEndConversation = require('../intentHandlers/globalFunctions')
const globalIntentHandlers = require('../intentHandlers/globalIntentHandlers')
const commonIntentHandlers = require('../intentHandlers/commonIntentHandlers')
const childSupportIntentHandlers = require('../intentHandlers/childSupportIntentHandlers')
const tanfIntentHandlers = require('../intentHandlers/tanfIntentHandlers')
const snapIntentHandlers = require('../intentHandlers/snapIntentHandlers')
const wfdIntentHandlers = require('../intentHandlers/wfdIntentHandlers')
const { mapDeliverMap } = require('../intentHandlers/common/map.js')
const getSubjectMatter = require('../utils/getSubjectMatter.js')
const { subjectMatterLocations } = require('../constants/constants.js')
const { getTextResponses, getSuggestions, genericHandler, shouldHandleEndConversation } = require('../utils/fulfillmentMessages.js')

const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined) {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
}

// Regex to retrieve text after last "/" on a path
const getIdFromPath = path => /[^/]*$/.exec(path)[0]

const saveRequest = async (reqData, subjectMatter) => {
  const intentId = getIdFromPath(reqData.queryResult.intent.name)

  reqData.createdAt = admin.firestore.Timestamp.now()
  reqData.intentId = intentId

  let currentSubjectMatter = subjectMatter
  if (currentSubjectMatter === undefined || currentSubjectMatter === '') {
    currentSubjectMatter = 'general'
  }

  return db.collection(`subjectMatters/${currentSubjectMatter}/requests`).add(reqData)
}

module.exports = async (request, response) => {
  if (request.method === 'GET' && request.query.healthCheck) {
    // Using a health check endpoint to keep the function warm
    response.status(200).send()
  } else {
    console.time('--- Fulfillment function')
    console.timeLog('--- Fulfillment function', 'Started')

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
    const savingRequest = saveRequest(request.body, subjectMatter)

    const intentName = request.body.queryResult.intent.displayName

    let intentHandlers = {
      // The current intent always needs a handler, so we create a default placeholder
      // If the intent has an actual handler, the default will be overwritten by the proceeding
      // spread objects
      [intentName]: () => {
        const dialogflowTextResponses = getTextResponses(request.body.queryResult.fulfillmentMessages)
        const dialogflowSuggestions = getSuggestions(request.body.queryResult.fulfillmentMessages)

        genericHandler(agent, dialogflowTextResponses, dialogflowSuggestions)

        if (shouldHandleEndConversation(request.body.queryResult.fulfillmentMessages)) {
          handleEndConversation(agent)
        }
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

    console.timeLog('--- Fulfillment function', 'Adding back and home handlers finished ')
    console.timeLog('--- Fulfillment function', 'Request handling started')

    await agent.handleRequest(new Map(Object.entries(intentHandlers)))

    console.timeLog('--- Fulfillment function', 'Request handing finished')
    console.timeLog('--- Fulfillment function', 'Saving request started')

    await savingRequest

    console.timeEnd('--- Fulfillment function', 'Saving request finished, fulfillment function finished')
  }
}