const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId

// Instantiate a Dialogflow client.
const dialogflow = require('@google-cloud/dialogflow')

const Logger = require('../utils/Logger')
const logger = new Logger('Dialogflow Request')

// For deployment
const sessionClient = new dialogflow.SessionsClient()
module.exports = async (req, reqType) => {
  const languageCode = 'en-US'

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

  const queryInput = reqType === 'text'
    ? { text: { text: query, languageCode: languageCode } }
    : { event: { name: query, languageCode: languageCode } }

  const dfRequest = {
    session: sessionPath,
    queryInput,
  }

  const responses = await sessionClient.detectIntent(dfRequest)

  // Code 0 === Webhook execution successful
  // Code 4 === Webhook call failed. Error: DEADLINE_EXCEEDED.
  // Code 14 === Webhook call failed. Error: UNAVAILABLE.
  if (responses[0].webhookStatus.code !== 0) {
    logger.error('Webhook Error', responses[0].webhookStatus.message)
  }

  responses[0].session = sessionPath

  return ({
    ...responses[0],
    session: sessionPath
  })
}
