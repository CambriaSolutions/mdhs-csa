const functions = require('firebase-functions')
const req = require('request')
const { WebhookClient } = require('dialogflow-fulfillment')

const buildIntentMap = require(`../../${process.env.SUBJECT_MATTER}/intentMapper.js`)

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

    const agent = new WebhookClient({ request, response })

    const intentMap = buildIntentMap()

    // TODO NEED TO REFACTOR ALL THE CODE BELOW

    // List of intents what will reset the back button context
    const resetBackIntentList = [
      'yes-child-support',
      'Default Welcome Intent',
      'support-submit-issue',
    ]

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
