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
  const dataForDocument = [category, categoriesWithIntents[category]]
  categories.push(dataForDocument)
}

categories.forEach(async category => {
  console.log(`Saving category: ${category}`)
  await db
    .collection('mlCategories')
    .doc(category[0])
    .set(category[1])
  console.log(`Saved category: ${category}`)
})
