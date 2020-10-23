import dotenv from 'dotenv'
dotenv.config()
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
admin.initializeApp()

import dialogflowFirebaseFulfillment from './httpTriggers/dialogflowFirebaseFulfillment'
import eventRequest from './httpTriggers/eventRequest'
import textRequest from './httpTriggers/textRequest'
import downloadExport from './httpTriggers/downloadExport'
import storeFeedback from './httpTriggers/storeFeedback'
import trainAgent from './databaseTriggers/trainAgent'
import storeAnalytics from './databaseTriggers/storeAnalytics'
import importDataset from './scheduledTriggers/importDataset'
import trainModels from './scheduledTriggers/trainModels'
import healthCheck from './scheduledTriggers/healthCheck'
import exportBackup from './scheduledTriggers/exportBackup'

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '2GB',
}

// Http Triggers
const httpTriggers = {
  dialogflowFirebaseFulfillment: { handler: dialogflowFirebaseFulfillment, corsEnabled: false },
  eventRequest: { handler: eventRequest, corsEnabled: true },
  textRequest: { handler: textRequest, corsEnabled: true },
  downloadExport: { handler: downloadExport, corsEnabled: true },
  storeFeedback: { handler: storeFeedback, corsEnabled: true },
}

// Database Triggers
const databaseTriggers = {
  trainAgent: { event: 'onUpdate', path: '/subjectMatters/{subjectMatter}/queriesForTraining/{id}', handler: trainAgent },
  storeAnalytics: { event: 'onCreate', path: '/subjectMatters/{subjectMatter}/requests/{id}', handler: storeAnalytics },
}

// Scheduled Triggers
const scheduledTriggers = {
  importDataset: { schedule: '0 20 * * *', timezone: 'America/Los_Angeles', handler: importDataset },
  trainModels: { schedule: '0 21 * * 1', timezone: 'America/Los_Angeles', handler: trainModels }, // Every Monday at 1 AM CST
  healthCheck: { schedule: '*/10 * * * *', timezone: 'America/Los_Angeles', handler: healthCheck }, // every 10 minutes
  exportBackup: { schedule: '0 1 * * *', timezone: 'America/Los_Angeles', handler: exportBackup }, // every day 1 AM PST
}

// Register HTTP Triggers
import cors from 'cors'
cors({
  origin: true
})

const httpTriggerWrapper = async (handler, corsEnabled, req, res) => {
  try {
    if (corsEnabled) {
      return cors(req, res, () => { handler(req, res) })
    } else {
      return handler(req, res)
    }
  } catch (e) {
    console.error(e.message, e)
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
  } catch (e) {
    console.error(e.message, e)
  }
}

Object.entries(databaseTriggers).forEach(([triggerName, databaseTrigger]) => {
  const document = functions.runWith(runtimeOpts).firestore.document(databaseTrigger.path)

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
    console.error('Unknown event type for database trigger')
  }

  if (cloudFunction) {
    exports[triggerName] = cloudFunction
  }
})

// Register Scheduled Triggers
const scheduledTriggerWrapper = (handler, context) => {
  try {
    return handler(context)
  } catch (e) {
    console.error(e.message, e)
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