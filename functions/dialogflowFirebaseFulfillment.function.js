const functions = require('firebase-functions');
const req = require('request');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const backIntent = require('./intentHandlers/back');
const home = require('./intentHandlers/home');
const { globalIntentHandlersMap } = require('./intentHandlers/globalIntentHandlersMap');
const { commonIntentHandlersMap } = require('./intentHandlers/common/commonIntentHandlersMap');
const { childSupportIntentHandlersMap } = require('./intentHandlers/childSupport/childSupportIntentHandlerMap.js');

function union(targetMap, sourceMap) {
  for (const key in sourceMap) {
    if(!targetMap.has(key)) {
      targetMap.set(key, map[key]);
    }
  }
}

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

    const intentMap = new Map();
    union(intentMap, globalIntentHandlersMap);
    union(intentMap, commonIntentHandlersMap);
    union(intentMap, childSupportIntentHandlersMap);
    console.info(`Intent Handlers: ${JSON.stringify(intentMap.keys)}`);

    // List of intents what will reset the back button context
    const resetBackIntentList = [
      'yes-child-support',
      'Default Welcome Intent',
      'support-submit-issue',
    ]

    const agent = new WebhookClient({ request, response })
    await backIntent(agent, intentMap, resetBackIntentList)
    await home(agent, intentMap, [
      'Default Welcome Intent',
      'yes-child-support',
      'restart-conversation',
      'global-restart',
      'acknowledge-privacy-statement',
      'not-child-support-root',
    ])
    await agent.handleRequest(intentMap)
  })
