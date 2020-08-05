const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase)

const dialogflowFirebaseFulfillment = require('./httpTriggers/dialogflowFirebaseFulfillment')
const eventRequest = require('./httpTriggers/eventRequest')
const textRequest = require('./httpTriggers/textRequest')
const downloadExport = require('./httpTriggers/downloadExport')
const storeFeedback = require('./httpTriggers/storeFeedback')
const trainAgent = require('./databaseTriggers/trainAgent')
const importDataset = require('./scheduledTriggers/importDataset')
const trainModels = require('./scheduledTriggers/trainModels')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

// Http Triggers
const httpTriggers = {
  dialogflowFirebaseFulfillment: { handler: dialogflowFirebaseFulfillment, corsEnabled: false },
  eventRequest: {  handler: eventRequest, corsEnabled: true },
  textRequest: {  handler: textRequest, corsEnabled: true },
  downloadExport: {  handler: downloadExport, corsEnabled: true },
  storeFeedback: {  handler: storeFeedback, corsEnabled: true }
}

// Database Triggers
const databaseTriggers = {
  trainAgent: { event: 'onUpdate', path: '/subjectMatters/{subjectMatter}/queriesForTraining/{id}', handler: trainAgent },
}

// Scheduled Triggers
const scheduledTriggers = {
  importDataset: {  schedule: '0 20 * * *', timezone: 'America/Los_Angeles', handler: importDataset},
  trainModels: {  schedule: '0 21 * * 1', timezone: 'America/Los_Angeles', handler: trainModels} // Every Monday at 1 AM CST
}

// Register HTTP Triggers
const cors = require('cors')({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS']
})

const httpTriggerWrapper = async (handler, corsEnabled, req, res) => {
  try {
    if (corsEnabled) {
      return cors(req, res, handler(req, res))
    } else {
      return handler(req, res)
    }
  } catch (e) {
    console.error(e)
  }
}

Object.entries(httpTriggers).forEach(([triggerName, httpTrigger]) => {
  exports[triggerName] = functions
    .runWith(runtimeOpts)
    .https
    .onRequest(async (req, res) => httpTriggerWrapper(httpTrigger.handler, httpTrigger.corsEnabled, req, res))
})

// Register Database Triggers
const databaseTriggerWrapper = async (handler, doc, context) => {
  try {
    return handler(doc, context)
  } catch(e) {
    console.error(e)
  }
}

Object.entries(databaseTriggers).forEach(([triggerName, databaseTrigger]) => {
  const document = functions.firestore.document(databaseTrigger.path)

  let cloudFunction
  if (databaseTrigger.event === 'onCreate') {
    cloudFunction = document.onCreate(async (snapshot, context) => databaseTriggerWrapper(databaseTrigger.handler, snapshot, context))
  } else if (databaseTrigger.event === 'onUpdate') {
    cloudFunction = document.onUpdate(async (change, context) => databaseTriggerWrapper(databaseTrigger.handler, change, context))
  } else if (databaseTrigger.event === 'onWrite') {
    cloudFunction = document.onWrite(async (change, context) => databaseTriggerWrapper(databaseTrigger.handler, change, context))
  } else if (databaseTrigger.event === 'onDelete') {
    cloudFunction = document.onDelete(async (snapshot, context) => databaseTriggerWrapper(databaseTrigger.handler, snapshot, context))
  } else {
    console.error('Unknown event type for database trigger', databaseTrigger)
  }

  if(cloudFunction) {
    exports[triggerName] = cloudFunction
  }
})

// Register Scheduled Triggers
const scheduledTriggerWrapper = (handler, context) => {
  try {
    return handler(context)
  } catch(e) {
    console.error(e)
  }
}

Object.entries(scheduledTriggers).forEach(([triggerName, scheduledTrigger]) => {
  exports[triggerName] = functions
    .runWith(runtimeOpts)
    .pubsub
    .schedule(scheduledTrigger.schedule)
    .timeZone(scheduledTrigger.timezone)
    .onRun(async (context) => scheduledTriggerWrapper(scheduledTrigger.handler, context))
})