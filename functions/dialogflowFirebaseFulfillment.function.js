const functions = require('firebase-functions')
const req = require('request')
const { WebhookClient } = require('dialogflow-fulfillment')
const backIntent = require('./intentHandlers/back')
const home = require('./intentHandlers/home')
const globalIntentHandlers = require('./intentHandlers/globalIntentHandlers')
const commonIntentHandlers = require('./intentHandlers/common/commonIntentHandlers')
const childSupportIntentHandlers = require('./intentHandlers/childSupport/childSupportIntentHandler')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (request, response) => {
    console.log(
      'Dialogflow Request headers: ' + JSON.stringify(request.headers)
    )
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body))
    req({
      method: 'POST',
      uri: process.env.ANALYTICS_URI,
      body: request.body,
      json: true,
    })

    let intentHandlers = { ...globalIntentHandlers, ...commonIntentHandlers, ...childSupportIntentHandlers }

    // List of intents what will reset the back button context
    const resetBackIntentList = [
      'yes-child-support',
      'Default Welcome Intent',
      'support-submit-issue',
    ]

    const agent = new WebhookClient({ request, response })
    await backIntent(agent, intentHandlers, resetBackIntentList)
    await home(agent, intentHandlers, [
      'Default Welcome Intent',
      'yes-child-support',
      'restart-conversation',
      'global-restart',
      'acknowledge-privacy-statement',
      'not-child-support-root',
    ])

    await agent.handleRequest(new Map(Object.entries(intentHandlers)))
  })
