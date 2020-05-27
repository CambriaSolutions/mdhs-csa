import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as dialogflow from '@google-cloud/dialogflow'
import * as corsPackage from 'cors'

const projectId = admin.instanceId().app.options.projectId //https://firebase.google.com/docs/reference/admin/node/admin.instanceId
const languageCode = 'en-US'

// For deployment
const sessionClient: any = new dialogflow.SessionsClient()

// // For local testing uncomment below and comment out sessionClient
// // above.
// const sessionClient = new dialogflow.SessionsClient({
//   keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT,
// })

const cors = corsPackage({
  origin: true,
})

const runtimeOpts: functions.RuntimeOptions = {
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

      // The event query request.
      const sessionPath = sessionClient.sessionPath(projectId, sessionId)

      const dfRequest: any = {
        session: sessionPath,
        queryInput: { event: { name: query, languageCode: languageCode } },
      }

      return sessionClient
        .detectIntent(dfRequest)
        .then((responses: any) => {
          responses[0].session = sessionPath
          res.json(responses[0])
        })
        .catch((err: any) => {
          return `Dialogflow error: ${err}`
        })
    })
  })
