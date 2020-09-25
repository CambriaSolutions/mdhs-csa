const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId
const languageCode = 'en-US'

// Instantiate a Dialogflow client.
const dialogflow = require('@google-cloud/dialogflow')

// For deployment
const sessionClient = new dialogflow.SessionsClient()

module.exports = async (req, reqType) => {
  console.time(`-X- ${reqType} Request', 'Starting detectIntent`)

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

  console.timeLog(`-X- ${reqType} Request', 'Starting detectIntent`)

  const responses = await sessionClient.detectIntent(dfRequest)

  if (responses[0].webhookStatus.code !== 200) {
    console.error(responses[0].webhookStatus.message)
  }

  console.timeLog(`-X- ${reqType} Request', 'Finished detectIntent`)

  responses[0].session = sessionPath

  console.timeEnd(`-X- ${reqType} Request', 'Finished ${reqType}Request`)

  return ({
    ...responses[0],
    session: sessionPath
  })
}
