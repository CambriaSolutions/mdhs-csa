require('dotenv').config()
const format = require('date-fns/format')
const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId
const firestore = require('@google-cloud/firestore')
const firestoreClient = new firestore.v1.FirestoreAdminClient()
const dialogflow = require('dialogflow')
const dialogflowClient = new dialogflow.v2.AgentsClient()

const exportingFirestore = async (bucket) => {
  const firestoreBucket = `${bucket}/firestore`
  const databaseName = firestoreClient.databasePath(projectId, '(default)')
  const responses = await firestoreClient.exportDocuments({
    name: databaseName,
    outputUriPrefix: firestoreBucket,
    // Leave collectionIds empty to export all collections
    // or set to a list of collection IDs to export,
    // collectionIds: ['users', 'posts']
    collectionIds: []
  })

  const response = responses[0]
  console.log(`Firestore Operation Name: ${response['name']}`)
}

const exportingDialogflow = async (bucket) => {
  const dialogflowBucket = `${bucket}/dialogflow.zip`
  console.log('Exporting to: ', dialogflowBucket)
  const responses = await dialogflowClient.exportAgent({ parent: `projects/${projectId}`, 'agentUri': dialogflowBucket })

  const response = responses[0]
  console.log(`Dialogflow Operation Name: ${response['name']}`)
}

module.exports = async () => {
  try {
    const dateKey = format(new Date(), 'MM-DD-YYYY')
    const bucket = `gs://${projectId}.appspot.com/backups/${dateKey}`

    await Promise.all([
      exportingFirestore(bucket),
      exportingDialogflow(bucket)
    ])

    console.log(`Backups initiated for ${dateKey}`)
  } catch (e) {
    console.error(e.message, e.stack)
  }
}
