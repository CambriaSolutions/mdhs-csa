require('dotenv').config()
const admin = require('firebase-admin')

const { categoriesWithIntents } = require('./mlCategories')
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})
const db = admin.firestore()

const categories = []
for (const category in categoriesWithIntents) {
  categories.push(categoriesWithIntents[category])
}

categories.forEach(async category => {
  const { intent, suggestionText } = category
  if (suggestionText) {
    await db
      .collection('intents')
      .doc(intent)
      .update({
        suggestionButtonText: suggestionText,
      })
      .catch(e => {
        console.error(e)
      })
  }
})
