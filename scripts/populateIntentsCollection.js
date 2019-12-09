const admin = require('firebase-admin')
const dialogflow = require('dialogflow')

require('dotenv').config()
// Accessible from the firebase console.
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Accessible from the firebase console.
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})
const projectId = process.env.PROJECT_ID
const db = admin.firestore()

const intentsClient = new dialogflow.IntentsClient()

// // The path to identify the agent that owns the intents.
const projectAgentPath = intentsClient.projectAgentPath(projectId)

const request = {
  parent: projectAgentPath,
  languageCode: 'en',
  intentView: 'INTENT_VIEW_FULL',
}

let intents = []
// Send the request for listing intents.
intentsClient
  .listIntents(request)
  .then(responses => {
    console.log('Retrieved intents')
    const resources = responses[0]
    resources.forEach(intent => {
      const intentData = {
        intentName: intent.displayName,
        suggestionButtonText: [],
        presentedSuggestions: [],
        autoSuggestions: [],
        isAutoSuggestionsEnabled: false,
      }
      const dataForDocument = [intent.displayName, intentData]
      intents.push(dataForDocument)
    })
  })
  .then(() => {
    intents.forEach(async intent => {
      console.log(`Saving intent: ${intent}`)
      await db
        .collection('intents')
        .doc(intent[0])
        .set(intent[1])
      console.log(`Saved intent: ${intent}`)
    })
  })
