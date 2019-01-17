const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')

const { pmtRoot } = require('./payments.js')
const { apptsRoot } = require('./appointments.js')
const {
  comptsRoot,
  comptsValidateName,
  comptsPhoneNumber,
  comptsCaseNumber,
  comptsCollectIssue,
  comptsSummarizeIssue,
  comptsReviseIssue,
  comptsSumbitIssue,
} = require('./complaints.js')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

// const admin = require('firebase-admin')
// const db = admin.firestore()
// const settings = { timestampsInSnapshots: true }
// db.settings(settings)

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response })

    const welcome = async agent => {
      try {
        await agent.add(
          `Hi, I'm Gen. I can help you with common child support requests. 
          Are you here to get help with Child Support?`
        )
        await agent.add(new Suggestion('Yes'))
        await agent.add(new Suggestion('No'))
        await agent.context.set({
          name: 'waiting-not-child-support',
          lifespan: 2,
        })
        await agent.context.set({
          name: 'waiting-yes-child-support',
          lifespan: 2,
        })
      } catch (err) {
        console.error(err)
      }
    }

    const yesChildSupport = async agent => {
      try {
        await agent.add(`What can I help you with today?`)
        await agent.add(new Suggestion('Appointments'))
        await agent.add(new Suggestion('Payments'))
        await agent.add(new Suggestion('Complaints'))
      } catch (err) {
        console.error(err)
      }
    }
    // Should we add the suggestions from yes-child-support?
    const notChildSupport = async agent => {
      try {
        await agent.add(
          `Sorry, I'm still learning to help with other issues. 
          Is there anything else I can help with?`
        )
      } catch (err) {
        console.error(err)
      }
    }

    let intentMap = new Map()
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('yes-child-support', yesChildSupport)
    intentMap.set('not-child-support', notChildSupport)
    intentMap.set('pmt-root', pmtRoot)
    intentMap.set('appts-root', apptsRoot)

    // Complaints intents
    intentMap.set('compts-root', comptsRoot)
    intentMap.set('compts-name', comptsValidateName)
    intentMap.set('compts-phone-number', comptsPhoneNumber)
    intentMap.set('compts-case-number', comptsCaseNumber)
    intentMap.set('compts-collect-issue', comptsCollectIssue)
    intentMap.set('compts-summarize-issue', comptsSummarizeIssue)
    intentMap.set('compts-revise-issue', comptsReviseIssue)
    intentMap.set('compts-submit-issue', comptsSumbitIssue)

    agent.handleRequest(intentMap)
  })
