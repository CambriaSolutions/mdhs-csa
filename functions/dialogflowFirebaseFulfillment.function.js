const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')

// Payments intents
const {
  pmtRoot,
  pmtTimeframe,
  pmtUnknownIncome,
  pmtHandleTimeframe,
  pmtIncome,
  pmtNumChildren,
  pmtNumMothers,
} = require('./payments.js')

// Appointments intents
const {
  apptsRoot,
  apptsSchedule,
  apptsNoContacted,
  apptsYesContacted,
  apptsOfficeLocations,
  apptsGuidelines,
} = require('./appointments.js')

// Complaints intents
const {
  comptsRoot,
  comptsValidateName,
  comptsPhoneNumber,
  comptsCaseNumber,
  comptsEmail,
  comptsCollectIssue,
  comptsSummarizeIssue,
  comptsReviseIssue,
  comptsSumbitIssue,
} = require('./complaints.js')

// Map intents
const { mapRoot, mapDeliverMap } = require('./map.js')

// Direct deposit intents
const {
  dirDepRoot,
  dirDepConfirmForm,
  dirDepShowForm,
  dirDepLearnMore,
  dirDepChange,
  dirDepStart,
  dirDepStop,
  dirDepChecking,
  dirDepSavings,
  dirDepAccountTerm,
  dirDepTakeEffect,
  dirDepExtraFunds,
} = require('./directDeposit.js')

// IWO intents
const {
  iwoRoot,
  iwoWantsAssistance,
  iwoIsSupporting,
  iwoInArrears,
  iwoCalculateArrears,
  iwoConfirmEstimate,
  iwoRequestDisposibleIncome,
} = require('./incomeWitholding.js')

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

    const restartConversation = async agent => {
      try {
        await agent.add(`What can I help you with?`)
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
        await agent.add(`I can help you with these topics.`)
        await agent.add(new Suggestion('Appointments'))
        await agent.add(new Suggestion('Payments'))
        await agent.add(new Suggestion('Complaints'))
      } catch (err) {
        console.error(err)
      }
    }

    let intentMap = new Map()
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('restart-conversation', restartConversation)
    intentMap.set('yes-child-support', yesChildSupport)
    intentMap.set('not-child-support', notChildSupport)

    // Payments intents
    intentMap.set('pmt-root', pmtRoot)
    intentMap.set('pmt-timeframe', pmtTimeframe)
    intentMap.set('pmt-unknown-income', pmtUnknownIncome)
    intentMap.set('pmt-handle-timeframe', pmtHandleTimeframe)
    intentMap.set('pmt-income', pmtIncome)
    intentMap.set('pmt-num-children', pmtNumChildren)
    intentMap.set('pmt-num-mothers', pmtNumMothers)

    // IWO intents
    intentMap.set('iwo-root', iwoRoot)
    intentMap.set('iwo-wants-assistance', iwoWantsAssistance)
    intentMap.set('iwo-is-supporting', iwoIsSupporting)
    intentMap.set('iwo-in-arrears', iwoInArrears)
    intentMap.set('iwo-confirm-estimate', iwoConfirmEstimate)
    intentMap.set('iwo-request-disposible-income', iwoRequestDisposibleIncome)

    // Appointment intents
    intentMap.set('appts-root', apptsRoot)
    intentMap.set('appts-schedule', apptsSchedule)
    intentMap.set('appts-no-contacted', apptsNoContacted)
    intentMap.set('appts-yes-contacted', apptsYesContacted)
    intentMap.set('appts-office-locations', apptsOfficeLocations)
    intentMap.set('appts-guidelines', apptsGuidelines)

    // Complaints intents
    intentMap.set('compts-root', comptsRoot)
    intentMap.set('compts-name', comptsValidateName)
    intentMap.set('compts-phone-number', comptsPhoneNumber)
    intentMap.set('compts-email', comptsEmail)
    intentMap.set('compts-case-number', comptsCaseNumber)
    intentMap.set('compts-collect-issue', comptsCollectIssue)
    intentMap.set('compts-summarize-issue', comptsSummarizeIssue)
    intentMap.set('compts-revise-issue', comptsReviseIssue)
    intentMap.set('compts-submit-issue', comptsSumbitIssue)

    // Map intents
    intentMap.set('map-root', mapRoot)
    intentMap.set('map-deliver-map', mapDeliverMap)

    // Direct deposit intents
    intentMap.set('dirDep-root', dirDepRoot)
    intentMap.set('dirDep-confirm-form', dirDepConfirmForm)
    intentMap.set('dirDep-show-form', dirDepShowForm)
    intentMap.set('dirDep-learn-more', dirDepLearnMore)
    intentMap.set('dirDep-change', dirDepChange)
    intentMap.set('dirDep-start', dirDepStart)
    intentMap.set('dirDep-stop', dirDepStop)
    intentMap.set('dirDep-checking', dirDepChecking)
    intentMap.set('dirDep-savings', dirDepSavings)
    intentMap.set('dirDep-account-term', dirDepAccountTerm)
    intentMap.set('dirDep-take-effect', dirDepTakeEffect)
    intentMap.set('dirDep-extra-funds', dirDepExtraFunds)

    agent.handleRequest(intentMap)
  })
