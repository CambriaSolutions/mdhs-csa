require('dotenv').config()
const admin = require('firebase-admin')

const { categoriesWithIntents } = require('./mlCategories')

admin.initializeApp()
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
