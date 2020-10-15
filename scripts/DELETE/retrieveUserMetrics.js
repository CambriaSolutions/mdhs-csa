require('dotenv').config()
const admin = require('firebase-admin')
const fs = require('fs')

admin.initializeApp()

const db = admin.firestore()
const subjectMatterName = 'cse'
const context = `subjectMatter/${subjectMatterName}`
const metricsRef = db.collection(`${context}/metrics`)
const dailyUserMetrics = []

// This function is used to create a csv file that lists the amount of total users 
// and engaged users per day.
const retrieveUserMetrics = async () => {
  try {

    const querySnapshot = await metricsRef.get()

    querySnapshot.forEach(doc => {
      dailyUserMetrics.push({
        date: doc.id,
        totalUsers: doc.data().numConversations,
        totalEngagedUsers: doc.data().numConversationsWithDuration
      })
    })

    let f = fs.openSync('./userMetrics.csv', 'w')

    dailyUserMetrics.forEach((dayMetrics) => {
      fs.writeSync(f, `${dayMetrics.date}, ${dayMetrics.totalUsers}, ${dayMetrics.totalEngagedUsers} \n`)
    })

    fs.close(f, async () => {
      console.log('File completed')
    })

    console.log('dailyUserMetrics')
    console.log(dailyUserMetrics)
  } catch (e) {
    console.error(e)
  }
}

retrieveUserMetrics();