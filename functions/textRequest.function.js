const functions = require('firebase-functions')
const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId //https://firebase.google.com/docs/reference/admin/node/admin.instanceId
const languageCode = 'en-US'

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow')
const sessionClient = new dialogflow.SessionsClient()

const cors = require('cors')({
  origin: true,
})

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {
    return cors(req, res, () => {
      if (!req.query || !req.query.query) {
        return 'The "query" parameter is required'
      }
      if (!req.query || !req.query.uuid) {
        return 'The "uuid" parameter is required'
      }
      const query = req.query.query
      const sessionId = req.query.uuid
      // The text query request.
      const sessionPath = sessionClient.sessionPath(projectId, sessionId)
      const dfRequest = {
        session: sessionPath,
        queryInput: { text: { text: query, languageCode: languageCode } },
      }

      return sessionClient
        .detectIntent(dfRequest)
        .then(responses => {
          // return responses[0]
          responses[0].session = sessionPath
          res.json(responses[0])
        })
        .catch(err => {
          return `Dialogflow error: ${err}`
        })
    })
  })
