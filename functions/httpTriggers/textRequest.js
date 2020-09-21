const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId
const languageCode = 'en-US'

// Instantiate a Dialogflow client.
const dialogflow = require('@google-cloud/dialogflow')

// For deployment
const sessionClient = new dialogflow.SessionsClient()

module.exports = async (req, res) => {
  console.time('--- Text Request')
  console.timeLog('--- Text Request', 'Starting textRequest')

  if (!req.query || !req.query.query) {
    return 'The "query" parameter is required'
  }

  if (!req.query || !req.query.uuid) {
    return 'The "uuid" parameter is required'
  }

  const query = req.query.query
  const sessionId = req.query.uuid
  // The text query request.
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  )
  const dfRequest = {
    session: sessionPath,
    queryInput: { text: { text: query, languageCode: languageCode } },
  }

  console.timeLog('--- Text Request', 'Starting detectIntent')

  const responses = await sessionClient.detectIntent(dfRequest)

  console.timeLog('--- Text Request', 'Finished detectIntent')

  responses[0].session = sessionPath
  res.json(responses[0])

  console.timeEnd('--- Text Request', 'Finished textRequest')
}
