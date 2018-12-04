const functions = require('firebase-functions')
const projectId = 'mdhs-csa' //https://dialogflow.com/docs/agents#settings
const sessionId = 'mdhs-csa-chat-session'
const languageCode = 'en-US'

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow')
const sessionClient = new dialogflow.SessionsClient()

const cors = require('cors')({
  origin: true
})

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId)

exports = module.exports = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!req.query || !req.query.query) {
      return 'The "query" parameter is required'
    }
    const query = req.query.query
    if (!query) {
      return 'Cannot get chat data without a user query'
    }
    // The text query request.
    const dfRequest = {
      session: sessionPath,
      queryInput: { text: { text: query, languageCode: languageCode } }
    }

    return sessionClient
      .detectIntent(dfRequest)
      .then(responses => {
        // return responses[0]
        res.json(responses[0])
      })
      .catch(err => {
        return `Dialogflow error: ${err}`
      })
  })
})
