const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId
const languageCode = 'en-US'

// Instantiate a Dialogflow client.
const dialogflow = require('@google-cloud/dialogflow')

// For deployment
const sessionClient = new dialogflow.SessionsClient()

module.exports = async (req, res) => {
  if (!req.query || !req.query.query) {
    return 'The "query" parameter is required'
  }
  if (!req.query || !req.query.uuid) {
    return 'The "uuid" parameter is required'
  }
  const query = req.query.query
  const sessionId = req.query.uuid
  // The event query request.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId)
  const dfRequest = {
    session: sessionPath,
    queryInput: { event: { name: query, languageCode: languageCode } },
  }

  const responses = await sessionClient.detectIntent(dfRequest)
  responses[0].session = sessionPath
  res.json(responses[0])
}
