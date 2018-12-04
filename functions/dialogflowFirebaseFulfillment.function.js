const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')

// const admin = require('firebase-admin')
// const db = admin.firestore()
// const settings = { timestampsInSnapshots: true }
// db.settings(settings)

exports = module.exports = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response })

  function welcome(agent) {
    agent.add(`Welcome to my agent!`)
  }

  let intentMap = new Map()
  intentMap.set('Default Welcome Intent', welcome)

  agent.handleRequest(intentMap)
})
