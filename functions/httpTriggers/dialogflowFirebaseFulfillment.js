const req = require('request')
const { WebhookClient } = require('dialogflow-fulfillment')
const backIntent = require('../intentHandlers/back')
const home = require('../intentHandlers/home')
const globalIntentHandlers = require('../intentHandlers/globalIntentHandlers')
const commonIntentHandlers = require('../intentHandlers/commonIntentHandlers')
const childSupportIntentHandlers = require('../intentHandlers/childSupportIntentHandlers')
const tanfIntentHandlers = require('../intentHandlers/tanfIntentHandlers')
const snapIntentHandlers = require('../intentHandlers/snapIntentHandlers')
const { mapDeliverMap } = require('../intentHandlers/common/map.js')
const cseLocations = require('../coordinates/cse.json')
const snapLocations = require('../coordinates/snap.json')
const tanfLocations = require('../coordinates/tanf.json')
const getSubjectMatter = require('../utils/getSubjectMatter.js')

const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined) {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
}

const subjectMatterLocations = {
  'cse': cseLocations,
  'snap': snapLocations,
  'tanf': tanfLocations
}

module.exports = async (request, response) => {
  console.log(
    'Dialogflow Request headers: ' + JSON.stringify(request.headers)
  )
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

  const agent = new WebhookClient({ request, response })

  const subjectMatter = getSubjectMatter(agent)

  let intentHandlers = {
    ...globalIntentHandlers,
    ...commonIntentHandlers,
    ...childSupportIntentHandlers,
    ...tanfIntentHandlers,
    ...snapIntentHandlers,
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

  await backIntent(agent, intentHandlers, resetBackIntentList)
  await home(agent, intentHandlers, resetHomeIntentList)

  await agent.handleRequest(new Map(Object.entries(intentHandlers)))

  req({
    method: 'POST',
    uri: process.env.ANALYTICS_URI,
    body: request.body,
    json: true,
  })
}