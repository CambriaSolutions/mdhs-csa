require('dotenv').config()

const admin = require('firebase-admin')

admin.initializeApp()

// Connect to DB
const store = admin.firestore()

// Function adds each of the subject matters as a document in the database subjectMatter collection
const createDatabaseSubjectMatters = async () => {
  const subjectMattersRef = store.collection(`subjectMatters`)

  const subjectMatters = ['general', 'cse', 'tanf', 'snap']

  subjectMatters.forEach(sm => {
    subjectMattersRef.doc(sm).set({})
  })
}

createDatabaseSubjectMatters()