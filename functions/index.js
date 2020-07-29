const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase)
const httpTriggers = require('./httpTriggers/httpTriggers')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

const cors = require('cors')({
  origin: true,
})

Object.entries(httpTriggers).forEach(([endpointName, trigger]) => {
  exports[endpointName] = functions
    .runWith(runtimeOpts)
    .https
    .onRequest(async (req, res) => {
      try {
        if (trigger.corsEnabled) {
          return cors(req, res, trigger.httpTrigger(req, res))
        } else {
          return trigger.httpTrigger(req, res)
        }
      } catch (e) {
        console.error(e)
        res.status(500).send()
      }
    })
})
