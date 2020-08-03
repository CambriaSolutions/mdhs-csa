require('dotenv').config()
const admin = require('firebase-admin')
const { format } = require('date-fns')
const fs = require('fs')
const analyzeQueries = require('./analyzeQueries')

admin.initializeApp()

// Regex to retrieve text after last "/" on a path
const getIdFromPath = path => /[^/]*$/.exec(path)[0]

const db = admin.firestore()

// Include your own start and end date
const start = new Date('Aug 1 2019 00:00:00 GMT-0700 (Pacific Daylight Time)')
const end = new Date('Sept 1 2019 00:00:00 GMT-0700 (Pacific Daylight Time)')

const intent = {
  name: 'Default Fallback Intent',
  id: 'd832e961-7c6c-4b00-a608-88a5c1c3f3f5',
}

const performQuery = (start, end, intent) => {
  db.collection(`subjectMatters/cse/requests`)
    .where('createdAt', '>', start)
    .where('createdAt', '<', end)
    .where('intentId', '==', intent.id)
    .orderBy('createdAt', 'desc')
    .get()
    .then(querySnapshot => {
      const intentDetails = []
      const intentQueries = []
      querySnapshot.forEach(doc => {
        let tempData = doc.data()
        intentDetails.push({
          intentDetectionConfidence:
            tempData.queryResult.intentDetectionConfidence,
          messageText: tempData.queryResult.queryText,
          outputContexts: tempData.queryResult.outputContexts
            ? tempData.queryResult.outputContexts.map(o => ({
              ...o,
              context: getIdFromPath(o.name),
            }))
            : [],
          conversationId: getIdFromPath(tempData.session),
          createdAt: format(tempData.createdAt.toDate(), 'MM-DD-YYYY'),
        })
        intentQueries.push(tempData.queryResult.queryText)
      })
      return ({ intentDetails, intentQueries })
    })
    .then(intentData => {
      const startDate = format(start, 'MM-DD')
      const endDate = format(end, 'MM-DD')

      // Save full intent data
      fs.writeFile(
        `./dataFiles/fallbackFullDetails_${startDate}_${endDate}.json`,
        JSON.stringify(intentData.intentDetails),
        err => {
          if (err) throw err
          console.log('Saved!')
        }
      )
      // Save user says details
      fs.writeFile(
        `./dataFiles/fallbackQueries_${startDate}_${endDate}.json`,
        JSON.stringify(intentData.intentQueries),
        err => {
          if (err) throw err
          console.log('Saved!')
        }
      )
      analyzeQueries(intentData.intentDetails)
    })
    .catch(err => {
      console.log(err)
    })
}

performQuery(start, end, intent)
