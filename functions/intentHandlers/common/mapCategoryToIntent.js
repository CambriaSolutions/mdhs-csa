// Retrieve suggestion text to display to users depending on the categetory/intent mapping
const retrieveIntentData = async category => {
  const admin = require('firebase-admin')
  const get = require('lodash/get')
  const camelCase = require('camelcase')
  const db = admin.firestore()

  // Format the category returned from ml models to match our db naming convention
  const formattedCategory = camelCase(category)

  // Create a reference for the mlCategory collection and retrieve the intent name
  // to reference the intent collection
  try {
    const categoryDocRef = db.collection('mlCategories').doc(formattedCategory)
    const categoryDoc = await categoryDocRef.get()
    const categoryData = categoryDoc.data()
    const intent = get(categoryData, 'intent')
    const suggestionText = get(categoryData, 'suggestionText')

    if (intent && suggestionText) {
      return {
        mlCategory: category,
        intent,
        suggestionText,
      }
    } else {
      return
    }
  } catch (error) {
    console.error(error)
  }
}

exports.mapCategoryToIntent = async categories => {
  // Create an array of db queries for each category returned from the ml models
  const promises = categories.map(async category => {
    return retrieveIntentData(category)
  })
  const suggestionResults = await Promise.all(promises)

  return suggestionResults.filter(suggestion => suggestion !== undefined)
}
