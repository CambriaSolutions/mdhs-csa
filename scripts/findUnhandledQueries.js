require('dotenv').config()
const format = require('date-fns/format')
const admin = require('firebase-admin')
const fs = require('fs')

admin.initializeApp()

const store = admin.firestore()

store
  .collection(
    `/subjectMatters/cse/requests/`
  )
  .where('intentId', '==', 'd832e961-7c6c-4b00-a608-88a5c1c3f3f5')
  .get()
  .then(values => {
    console.log('Number of results:', values)
    const janFirst = new Date(2020, 1, 1)
    let f = fs.openSync('./unhandledQueries.csv', 'w')

    for (let query of values.docs) {
      const queryDoc = query.data()
      const queryText = queryDoc.queryResult.queryText
      const createdAt = queryDoc.createdAt.toDate()

      if (createdAt >= janFirst) {
        const createdAtFormatted = format(createdAt, 'MM-DD-YYYY')
        const intentDisplayName = queryDoc.queryResult.intent.displayName
        fs.writeSync(f, `${queryText}\n`)
        console.log(`Query Text: (${queryText}), Intent Display Name: (${intentDisplayName}), Created At: (${createdAtFormatted})`)
      }
    }

    fs.close(f, async () => {
      console.log('File completed writing')
      // Uploads csv file to bucket for AutoML dataset import
    })
  })
