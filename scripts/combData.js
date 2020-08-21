require('dotenv').config()
const admin = require('firebase-admin')
const format = require('date-fns/format')
const parse = require('date-fns/parse')
const fs = require('fs')

admin.initializeApp()

const db = admin.firestore()

const performQuery = async (conversationsRef, startDate, endDate) => {
  let dailyMetric = {}
  let daysToInspect = []

  await conversationsRef
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let numConversations = 0
        let numConversationsWithDuration = 0
        let numConversationsWithSupportRequests = 0
        let conversationDuration = 0
        let exitIntents = {}

        const data = doc.data()

        const day = format(data.createdAt.toDate(), 'MM-DD-YYYY')

        // // Make a new day in the daily metric
        if (dailyMetric.hasOwnProperty(day)) {
          // Increment number of conversations
          dailyMetric[day].numConversations += 1

          // If the conversation has a duration, increment number of
          // conversations with a duration (engaged users) and add the
          // duration to the total duration for the day
          // if (data.duration && data.duration > 0) {
          if (data.duration && data.duration > 0 && data.duration < 86400) {
            // Used for average duration logic
            dailyMetric[day].conversationDuration += data.duration
            // Used for engaged users
            dailyMetric[day].numConversationsWithDuration += 1
          }

          // If the duration of the conversation is longer than 1 day
          // save to file to investigate later
          if (data.duration > 86400) {
            daysToInspect.push({
              day,
              conversationId: doc.id,
              duration: data.duration,
              hours: Math.round(data.duration / 3600),
            })
          }

          // Increment number of support requests
          if (data.hasSupportRequest) {
            dailyMetric[day].numConversationsWithSupportRequests += 1
          }

          // Increment exit intents per conversation
          if (data.lastIntent) {
            dailyMetric[day].exitIntents[doc.id] = data.lastIntent
          }
        } else {
          // Increment number of conversations
          numConversations += 1

          // If the conversation has a duration, increment number of
          // conversations with a duration (engaged users) and add the
          // duration to the total duration for the day
          if (data.duration && data.duration > 0) {
            conversationDuration += data.duration
            numConversationsWithDuration += 1
          }

          // Increment the number of conversations with support requests counter
          if (data.hasSupportRequest) {
            numConversationsWithSupportRequests += 1
          }

          // Increment exit intents per conversation
          if (data.lastIntent) {
            exitIntents[doc.id] = data.lastIntent
          }

          dailyMetric[day] = {
            numConversations,
            numConversationsWithDuration,
            numConversationsWithSupportRequests,
            conversationDuration,
            exitIntents,
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
  // Save wildcard conversation lengths to json for later investigation
  fs.writeFile('./daysToInspect.json', JSON.stringify(daysToInspect), err => {
    if (err) throw err
    console.log('Saved!')
  })
  return dailyMetric
}

const start = new Date('Jun 10 2019 00:00:00 GMT-0700 (Pacific Daylight Time)')
const end = new Date('Aug 28 2019 00:00:00 GMT-0700 (Pacific Daylight Time)')

const performQuerySuccessHandler = (metric, subjectMatter) => {
  // Create a reference for the metrics
  const metricsRef = db.collection(`subjectMatters/${subjectMatter}/metrics`)
  // Strip conversations from intents
  for (const day in metric) {
    const dayMetric = metricsRef.doc(day)

    // Format exit intents
    const exitIntents = metric[day].exitIntents
    let newExitIntents = []
    for (const intent in exitIntents) {
      const currentIntent = exitIntents[intent].name
      // Check to see if this intent is already on the list
      const exitIntentExists = newExitIntents.filter(
        intent => intent.name === currentIntent
      )[0]
      if (exitIntentExists) {
        exitIntentExists.occurrences++
      } else {
        const newExitIntent = {
          name: exitIntents[intent].name,
          id: exitIntents[intent].id,
          occurrences: 1,
        }
        newExitIntents.push(newExitIntent)
      }
    }

    let newDate
    let intents
    dayMetric
      .get()
      .then(doc => {
        const data = doc.data()

        // Pull out the intents, and strip conversations
        if (data) {
          data.intents.map(intent => {
            delete intent.conversations
          })
        }

        // Ensure that the date in the database matches the document id
        newDate = admin.firestore.Timestamp.fromDate(parse(doc.id))
        intents = data.intents
      })
      .then(() => {
        const {
          numConversations,
          numConversationsWithDuration,
          numConversationsWithSupportRequests,
          conversationDuration,
        } = metric[day]
        const averageConversationDuration = Math.round(
          conversationDuration / numConversationsWithDuration
        )
        dayMetric.update({
          averageConversationDuration,
          exitIntents: newExitIntents,
          numConversationsWithDuration,
          numConversationsWithSupportRequests,
          intents,
          date: newDate,
          numConversations,
        })
      })
  }
}

// TODO needs to be more generic to handle different subject matters. 
// Avoid hardcoding subject matters 
let conversationsRefCSE = db.collection(`subjectMatters/cse/conversations/`)

// Perform a query with start and end
performQuery(conversationsRefCSE, start, end).then(metric => performQuerySuccessHandler(metric, 'cse'))
