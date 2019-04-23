const functions = require('firebase-functions')
const req = require('request')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')

// General payment intents
const {
  pmtsGeneralRoot,
  pmtsGeneralReceivePayments,
  pmtsGeneralMakePayments,
} = require('./paymentsGeneral.js')

// Payment calculator intents
const {
  pmtCalcRoot,
  pmtCalcRootRestart,
  pmtCalcNumChildren,
  pmtCalcIncomeTerm,
  pmtCalcUnknownIncome,
  pmtCalcGrossIncome,
  pmtCalcTaxDeductions,
  pmtCalcSSNDeductions,
  pmtCalcRetirementContributions,
  pmtCalcRetirementContributionsAmount,
  pmtCalcChildSupport,
  pmtCalcChildSupportNoRetirement,
  pmtCalcChildSupportAmount,
  pmtCalcFinalEstimation,
  pmtCalcFinalEstimationNoOtherChildren,
} = require('./paymentsCalculator.js')

// Payment methods intents
const {
  pmtMethodsRoot,
  pmtMethodsCustodial,
  pmtMethodsNonCustodial,
  pmtMethodsEmployer,
  pmtMethodsNone,
  pmtMethodsCheckOrMoneyOrder,
  pmtMethodsCash,
  pmtMethodsEcheckDebit,
  pmtMethodsMoneygram,
} = require('./paymentMethods.js')

// Open Child Support Case
const {
  openCSCRoot,
  openCSCFullServices,
  openCSCSelectForm,
  openCSCLocationServices,
  openCSCCollectionEmployer,
  openCSCNoService,
} = require('./openChildSupportCase.js')

// Appointments intents
const {
  apptsRoot,
  apptsSchedule,
  apptsNoContacted,
  apptsYesContacted,
  apptsOfficeLocations,
  apptsGuidelines,
} = require('./appointments.js')

// Support intents
const {
  supportRoot,
  supportPaymentsRoot,
  supportRequestsRoot,
  supportChangeRoot,
  supportGeneralRoot,
  supportEmploymentStatus,
  supportHandleEmploymentStatus,
  supportType,
  supportCollectCompanyName,
  supportCollectName,
  supportPhoneNumber,
  supportNoPhoneNumber,
  supportCaseNumber,
  supportNoCaseNumber,
  supportEmail,
  supportNoEmail,
  supportCollectIssue,
  supportSummarizeIssue,
  supportReviseIssue,
  supportSumbitIssue,
} = require('./support.js')

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
  dirDepPaymentClosedAccount,
  dirDepLearnMoreEppiCard,
  dirDepNoLearnMoreEppiCard,
} = require('./directDeposit.js')

// EppiCard intents
const {
  eppiRoot,
  eppiGetCard,
  eppiActivateCard,
  eppiFees,
  eppiNotifications,
  eppiReplaceReport,
  eppiFAQ,
  eppiPaymentHistory,
  eppiUseCard,
  eppiWithdrawCash,
  eppiSurcharge,
  eppiLearnMore,
  eppiBalanceDenial,
} = require('./eppiCard.js')

// IWO intents
const {
  iwoRoot,
  iwoWantsAssistance,
  iwoNoAssistance,
  iwoIsSupporting,
  iwoInArrears,
  iwoConfirmEstimate,
  iwoRequestDisposableIncome,
  iwoDefineDisposableIncome,
  iwoDisposableIncome,
  iwoWhereToSubmit,
  iwoAdministrativeFee,
  iwoOtherGarnishments,
  iwoOtherState,
  iwoInsuranceCoverage,
  iwoNotAnEmployee,
  iwoFireEmployee,
} = require('./incomeWitholding.js')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response })

    // Send request body to analytics function
    /*req({
      method: 'POST',
      uri: process.env.ANALYTICS_URI,
      body: request.body,
      json: true,
    })*/

    const welcome = async agent => {
      try {
        await agent.add(
          `Hi, I'm Gen. I can help you with common child support requests. Are you here to get help with Child Support?`
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
        await agent.add(new Suggestion('Support'))
        await agent.add(new Suggestion('Appointments'))
        await agent.add(new Suggestion('Payments'))
        await agent.add(new Suggestion('Opening a Child Support Case'))
        await agent.add(new Suggestion('Policy Manual'))
      } catch (err) {
        console.error(err)
      }
    }

    const restartConversation = async agent => {
      try {
        await agent.add(`What can I help you with?`)
        await agent.add(new Suggestion('Support'))
        await agent.add(new Suggestion('Appointments'))
        await agent.add(new Suggestion('Payments'))
        await agent.add(new Suggestion('Opening a Child Support Case'))
        await agent.add(new Suggestion('Policy Manual'))
      } catch (err) {
        console.error(err)
      }
    }

    const notChildSupport = async agent => {
      try {
        await agent.add(
          `Sorry, I'm still learning to help with other issues. Is there anything else I can help with?`
        )
        await agent.add(`I can help you with these topics.`)
        await agent.add(new Suggestion('Support'))
        await agent.add(new Suggestion('Appointments'))
        await agent.add(new Suggestion('Payments'))
        await agent.add(new Suggestion('Opening a Child Support Case'))
        await agent.add(new Suggestion('Policy Manual'))
      } catch (err) {
        console.error(err)
      }
    }

    // Directs the user to Casey
    const caseyHandoff = async agent => {
      try {
        await agent.add(
          `Click <a href="https://mdhs-policysearch.firebaseapp.com" target="_blank">Here</a> to search the Child Support Policy Manual`
        )
      } catch (err) {
        console.error(err)
      }
    }

    let intentMap = new Map()
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('restart-conversation', restartConversation)
    intentMap.set('yes-child-support', yesChildSupport)
    intentMap.set('not-child-support', notChildSupport)
    intentMap.set('casey-handoff', caseyHandoff)

    // Payment calculation intents
    intentMap.set('pmt-calc-root', pmtCalcRoot)
    intentMap.set('pmt-calc-restart', pmtCalcRootRestart)
    intentMap.set('pmt-calc-num-children', pmtCalcNumChildren)
    intentMap.set('pmt-calc-income-term', pmtCalcIncomeTerm)
    intentMap.set('pmt-calc-unknown-income', pmtCalcUnknownIncome)
    intentMap.set('pmt-calc-gross-income', pmtCalcGrossIncome)
    intentMap.set('pmt-calc-tax-deductions', pmtCalcTaxDeductions)
    intentMap.set('pmt-calc-ssn-deductions', pmtCalcSSNDeductions)
    intentMap.set('pmt-calc-retirement-contributions', pmtCalcRetirementContributions)
    intentMap.set('pmt-calc-retirement-contributions-amount', pmtCalcRetirementContributionsAmount)
    intentMap.set('pmt-calc-child-support', pmtCalcChildSupport)
    intentMap.set('pmt-calc-child-support-no-retirement', pmtCalcChildSupportNoRetirement)
    intentMap.set('pmt-calc-child-support-amount', pmtCalcChildSupportAmount)
    intentMap.set('pmt-calc-final-estimation', pmtCalcFinalEstimation)
    intentMap.set('pmt-calc-final-estimation-no-other-children', pmtCalcFinalEstimationNoOtherChildren)

    // IWO intents
    intentMap.set('iwo-root', iwoRoot)
    intentMap.set('iwo-wants-assistance', iwoWantsAssistance)
    intentMap.set('iwo-no-assistance', iwoNoAssistance)
    intentMap.set('iwo-is-supporting', iwoIsSupporting)
    intentMap.set('iwo-in-arrears', iwoInArrears)
    intentMap.set('iwo-confirm-estimate', iwoConfirmEstimate)
    intentMap.set('iwo-request-disposable-income', iwoRequestDisposableIncome)
    intentMap.set('iwo-define-disposable-income', iwoDefineDisposableIncome)
    intentMap.set('iwo-disposable-income', iwoDisposableIncome)
    intentMap.set('iwo-where-to-submit', iwoWhereToSubmit)
    intentMap.set('iwo-administrative-fee', iwoAdministrativeFee)
    intentMap.set('iwo-other-garnishments', iwoOtherGarnishments)
    intentMap.set('iwo-other-state', iwoOtherState)
    intentMap.set('iwo-insurance-coverage', iwoInsuranceCoverage)
    intentMap.set('iwo-not-an-employee', iwoNotAnEmployee)
    intentMap.set('iwo-fire-employee', iwoFireEmployee)

    // General payment intents
    intentMap.set('pmts-general-root', pmtsGeneralRoot)
    intentMap.set('pmts-general-make-payments', pmtsGeneralMakePayments)
    intentMap.set('pmts-general-receive-payments', pmtsGeneralReceivePayments)

    // Payment methods intents
    intentMap.set('pmtMethods-root', pmtMethodsRoot)
    intentMap.set('pmtMethods-custodial', pmtMethodsCustodial)
    intentMap.set('pmtMethods-nonCustodial', pmtMethodsNonCustodial)
    intentMap.set('pmtMethods-employer', pmtMethodsEmployer)
    intentMap.set('pmtMethods-none', pmtMethodsNone)
    intentMap.set('pmtMethods-checkOrMoneyOrder', pmtMethodsCheckOrMoneyOrder)
    intentMap.set('pmtMethods-cash', pmtMethodsCash)
    intentMap.set('pmtMethods-eCheckDebit', pmtMethodsEcheckDebit)
    intentMap.set('pmtMethods-moneygram', pmtMethodsMoneygram)

    // Open a Child Support Case
    intentMap.set('open-csc-root', openCSCRoot)
    intentMap.set('open-csc-full-services', openCSCFullServices)
    intentMap.set('open-csc-select-form', openCSCSelectForm)
    intentMap.set('open-csc-location-services', openCSCLocationServices)
    intentMap.set('open-csc-employer-payments', openCSCCollectionEmployer)
    intentMap.set('open-csc-no-service', openCSCNoService)

    // Appointment intents
    intentMap.set('appts-root', apptsRoot)
    intentMap.set('appts-schedule', apptsSchedule)
    intentMap.set('appts-no-contacted', apptsNoContacted)
    intentMap.set('appts-yes-contacted', apptsYesContacted)
    intentMap.set('appts-office-locations', apptsOfficeLocations)
    intentMap.set('appts-guidelines', apptsGuidelines)

    // Support intents
    intentMap.set('support-root', supportRoot)
    intentMap.set('support-payments-root', supportPaymentsRoot)
    intentMap.set('support-requests-root', supportRequestsRoot)
    intentMap.set('support-change-root', supportChangeRoot)
    intentMap.set('support-general-root', supportGeneralRoot)
    intentMap.set('support-employment-status', supportEmploymentStatus)
    intentMap.set(
      'support-handle-employment-status',
      supportHandleEmploymentStatus
    )
    intentMap.set('support-type', supportType)
    intentMap.set('support-collect-company-name', supportCollectCompanyName)
    intentMap.set('support-collect-name', supportCollectName)
    intentMap.set('support-phone-number', supportPhoneNumber)
    intentMap.set('support-no-phone-number', supportNoPhoneNumber)
    intentMap.set('support-email', supportEmail)
    intentMap.set('support-no-email', supportNoEmail)
    intentMap.set('support-case-number', supportCaseNumber)
    intentMap.set('support-no-case-number', supportNoCaseNumber)
    intentMap.set('support-collect-issue', supportCollectIssue)
    intentMap.set('support-summarize-issue', supportSummarizeIssue)
    intentMap.set('support-revise-issue', supportReviseIssue)
    intentMap.set('support-submit-issue', supportSumbitIssue)

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
    intentMap.set('dirDep-payment-closed-account', dirDepPaymentClosedAccount)
    intentMap.set('dirDep-learn-more-eppicard', dirDepLearnMoreEppiCard)
    intentMap.set('dirDep-no-learn-more-eppicard', dirDepNoLearnMoreEppiCard)

    // EppiCard intents
    intentMap.set('eppi-root', eppiRoot)
    intentMap.set('eppi-get-card', eppiGetCard)
    intentMap.set('eppi-activate-card', eppiActivateCard)
    intentMap.set('eppi-fees', eppiFees)
    intentMap.set('eppi-notifications', eppiNotifications)
    intentMap.set('eppi-replace-report', eppiReplaceReport)
    intentMap.set('eppi-faq', eppiFAQ)
    intentMap.set('eppi-payment-history', eppiPaymentHistory)
    intentMap.set('eppi-use-card', eppiUseCard)
    intentMap.set('eppi-withdraw-cash', eppiWithdrawCash)
    intentMap.set('eppi-surcharge', eppiSurcharge)
    intentMap.set('eppi-learn-more', eppiLearnMore)
    intentMap.set('eppi-balance-denial', eppiBalanceDenial)

    agent.handleRequest(intentMap)
  })
