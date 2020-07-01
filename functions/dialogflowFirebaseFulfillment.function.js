const functions = require('firebase-functions')
const req = require('request')
const { WebhookClient } = require('dialogflow-fulfillment')
const backIntent = require('./intentHandlers/back')
const home = require('./intentHandlers/home')
const globalIntentHandlers = require('./globalIntentHandlers')
const commonIntentHandlers = require('./commonIntentHandlers')
const childSupportIntentHandlers = require('./childSupportIntentHandlers')
const tanfIntentHandlers = require('./tanfIntentHandlers')
const snapIntentHandlers = require('./snapIntentHandlers')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined)
  {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
}

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    try {
      console.log(
        'Dialogflow Request headers: ' + JSON.stringify(request.headers)
      )
      console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

      let intentHandlers = {
        ...globalIntentHandlers,
        ...commonIntentHandlers,
        ...childSupportIntentHandlers,
        ...tanfIntentHandlers,
        ...snapIntentHandlers
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

      const agent = new WebhookClient({ request, response })

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
    } catch (e) {
      console.error(e)
    }

    try {
      req({
        method: 'POST',
        uri: process.env.ANALYTICS_URI,
        body: request.body,
        json: true,
      })
    } catch (e) {
      console.error(e)
    }
  })
