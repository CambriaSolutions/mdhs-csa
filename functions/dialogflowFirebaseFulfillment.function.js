const functions = require('firebase-functions')
const req = require('request')
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment')
const {
  startRootConversation,
  disableInput,
  caseyHandoff,
} = require('./globalFunctions.js')
const { backIntent } = require('./components/back/back.js')

// Not child support intents
const {
  notChildSupportRoot,
  handleChildSupportRetry,
  handleAcknowledgementAfterRetry,
} = require('./notChildSupport.js')

// General enforcement intents
const {
  enforcementRoot,
  enforcementLicenseSuspensionReinstatement,
  enforcementLicenseSuspension,
  enforcementLicenseSuspensionNonCompliance,
  enforcementLicenseReinstatement,
  enforcementTaxOffset,
  enforcementLiens,
  enforcementContestLien,
  enforcementFinancialAccountUpdateCase,
  enforcementPersonalInjury,
  enforcementSettlementsUpdateCase,
  enforcementSettlementsNoUpdateCase,
  enforcementPassportRevocation,
  enforcementPassportReinstatement,
  enforcementCreditBureauReporting,
  enforcementReportError,
  enforcementUnemployment,
  enforcementSubmitInquiry,
  enforcementBankruptcy,
} = require('./enforcement.js')

// General payment intents
const {
  pmtsGeneralRoot,
  pmtsGeneralNonCustodial,
  pmtsGeneralReceivePayments,
  pmtsGeneralMakePayments,
} = require('./paymentsGeneral.js')

// Employer intents
const {
  employerRoot,
  employerEFT,
  employerIPayOnline,
  employerChecksMoneyOrders,
  employerIWOHandoff,
} = require('./employer.js')

// Payment calculator intents
const {
  pmtCalcRoot,
  pmtCalcRootRestart,
  pmtCalcNumChildren,
  pmtCalcIncomeTerm,
  pmtCalcUnknownIncome,
  pmtCalcGrossIncome,
  pmtCalcTaxDeductions,
  pmtCalcUnknownTaxDeductions,
  pmtCalcSSDeductions,
  pmtCalcUnknownSSDeductions,
  pmtCalcRetirementContributions,
  pmtCalcRetirementContributionsAmount,
  pmtCalcUnknownRetirementContributions,
  pmtCalcChildSupport,
  pmtCalcChildSupportNoRetirement,
  pmtCalcChildSupportAmount,
  pmtCalcUnknownOtherChildSupport,
  pmtCalcUnknownDeductions,
  pmtCalcFinalEstimation,
  pmtCalcFinalEstimationNoOtherChildren,
} = require('./paymentsCalculator.js')

// Payment methods intents
const {
  pmtMethodsNone,
  pmtMethodsCheckOrMoneyOrder,
  pmtMethodsCash,
  pmtMethodsEcheckDebit,
  pmtMethodsMoneygram,
  pmtMethodsPayNearMe,
  pmtMethodsCantMake,
  pmtMethodsCantMakeQualifying,
  pmtMethodsCantMakeQualifyingHelp,
  pmtMethodsCantMakeQualifyingNoHelp,
  pmtMethodsDebitCard,
  pmtMethodsNCPWithhold,
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

// Close Child Support Case
const { closeCSCQACloseCase } = require('./closeChildSupportCase.js')

// Case specific intents
const {
  caseQAIncreaseReview,
  caseQAGeneral,
  caseQAGeneralSupportRequest,
  caseQAChangePersonalInfo,
  caseQACompliance,
  caseQAComplianceSupportRequest,
} = require('./caseQA.js')

// Appointments intents
const {
  apptsRoot,
  apptsSchedule,
  apptsNoContacted,
  apptsYesContacted,
  apptsOfficeLocationsHandoff,
  apptsGuidelines,
  apptsQAOfficeHours,
  apptsQAMissedAppt,
} = require('./appointments.js')

// Support intents
const {
  supportRoot,
  supportRestart,
  supportParentReceiving,
  supportParentPaying,
  supportParentReceivingMore,
  supportEmployer,
  supportParentPayingMore,
  supportNoOptionsSelected,
  supportEmploymentStatus,
  supportHandleEmploymentStatus,
  supportCollectNewEmployerName,
  supportNoNewEmployer,
  supportNewEmployerUnkownPhone,
  supportCollectNewEmployerPhone,
  supportType,
  supportCollectCompanyName,
  supportCollectFirstName,
  supportCollectLastName,
  supportCollectName,
  supportPhoneNumber,
  supportNoPhoneNumber,
  supportCaseNumber,
  supportNoCaseNumber,
  supportEmail,
  supportNoEmail,
  supportRetryPhoneNumber,
  supportHandlePhoneRetry,
  supportRetryEmail,
  supportHandleEmailRetry,
  supportCollectIssue,
  supportSummarizeIssue,
  supportReviseIssue,
  supportSumbitIssue,
  supportCancel,
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
  iwoFAQs,
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
  iwoEmployerObligation,
  iwoHowLongToSend,
  iwoWhenToBegin,
  iwoEmployerSubmitPayments,
  iwoPaymentsHandoff,
  iwoQAArrearsBalance,
} = require('./incomeWithholding.js')

// Feedback
const {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} = require('./feedback.js')

// Genetic Testing
const {
  geneticTestingRequest,
  geneticTestingResults,
} = require('./geneticTesting.js')

// Support QA
const {
  supportQACpPictureId,
  supportQAWhoCanApply,
  supportQAOtherState,
  supportQANcpPrison,
} = require('./supportQA.js')

// Emancipation QA
const { emancipationAge } = require('./emancipationQA.js')

// Contact QA
const {
  contactQANumber,
  contactSupportHandoff,
  contactProvidePhoneNumber,
} = require('./contactQA.js')

// Payments QA
const {
  pmtQAHaventReceived,
  pmtQAPaymentReduction,
  pmtQAYesPaymentReduction,
  pmtQAOver21,
  pmtQAOver21SubmitRequest,
  pmtQAEmployerPaymentStatus,
  pmtQAYesEmployerPaymentStatus,
  pmtQANCPPaymentStatus,
  pmtQANCPPaymentStatusSubmitRequest,
} = require('./paymentsQA.js')

// ML model requests
const { handleUnhandled } = require('./categorizeAndPredict.js')

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

const preProcessIntent = async (agent, intentMap, request) => {
  const isHandled = agent.intent.toLowerCase() !== 'default fallback intent'
  // If the intent is handled by the agent, continue with default behavior
  if (isHandled) {
    agent.handleRequest(intentMap)
  } else {
    // The intent is unhandled, send the request for ML processing and handling
    agent.handleRequest(handleUnhandled)
  }

  // Send request body to analytics function
  req({
    method: 'POST',
    uri: process.env.ANALYTICS_URI,
    body: request.body,
    json: true,
  })
}

exports = module.exports = functions
  .runWith(runtimeOpts)
  .https.onRequest((request, response) => {
    console.log(
      'Dialogflow Request headers: ' + JSON.stringify(request.headers)
    )
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

    const agent = new WebhookClient({ request, response })

    const welcome = async agent => {
      try {
        await agent.add(
          `Hi, I'm Gen. I am not a real person, but I can help you with common child support requests. Are you here to get help with Child Support?`
        )
        await disableInput(agent)
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

    const fallback = async agent => {
      try {
        await agent.add(
          `I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.`
        )
        await agent.add(new Suggestion(`Home`))
      } catch (err) {
        console.error(err)
      }
    }

    const yesChildSupport = async agent => {
      try {
        await agent.add(
          `Great! I can assist you by providing general information about the child support program or by directing common child support requests to the appropriate MDHS team for handling. The information I provide is not legal advice. MDHS does not provide legal representation. Also, please do not enter SSN or DOB in at any time during your conversations.`
        )
        await agent.add(
          `By clicking "I Acknowledge" below you are acknowledging receipt and understanding of these statements and the MDHS Website Disclaimers, Terms, and Conditions found <a href="https://www.mdhs.ms.gov/privacy-disclaimer/" target="_blank">here</a>, and that you wish to continue.`
        )
        await agent.add(new Suggestion('I Acknowledge'))
        await disableInput(agent)
        await agent.context.set({
          name: 'waiting-acknowledge-privacy-statement',
          lifespan: 2,
        })
      } catch (err) {
        console.error(err)
      }
    }

    const restartConversation = async agent => {
      try {
        await startRootConversation(agent)
      } catch (err) {
        console.error(err)
      }
    }

    const acknowledgePrivacyStatement = async agent => {
      try {
        await startRootConversation(agent)
      } catch (err) {
        console.error(err)
      }
    }

    const globalRestart = async agent => {
      try {
        await startRootConversation(agent)
      } catch (err) {
        console.error(err)
      }
    }

    let intentMap = new Map()

    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('acknowledge-privacy-statement', acknowledgePrivacyStatement)
    intentMap.set('global-restart', globalRestart)
    intentMap.set('restart-conversation', restartConversation)
    intentMap.set('yes-child-support', yesChildSupport)
    intentMap.set('casey-handoff', caseyHandoff)

    // Contact number intents
    intentMap.set('contact-support-handoff', contactSupportHandoff)
    intentMap.set('contact-provide-phone-number', contactProvidePhoneNumber)

    // Not child support intents
    intentMap.set('not-child-support-root', notChildSupportRoot)
    intentMap.set('handle-child-support-retry', handleChildSupportRetry)
    intentMap.set(
      'acknowledgement-after-retry',
      handleAcknowledgementAfterRetry
    )

    // Payment calculation intents
    intentMap.set('pmt-calc-root', pmtCalcRoot)
    intentMap.set('pmt-calc-restart', pmtCalcRootRestart)
    intentMap.set('pmt-calc-num-children', pmtCalcNumChildren)
    intentMap.set('pmt-calc-income-term', pmtCalcIncomeTerm)
    intentMap.set('pmt-calc-unknown-income', pmtCalcUnknownIncome)
    intentMap.set('pmt-calc-gross-income', pmtCalcGrossIncome)
    intentMap.set('pmt-calc-tax-deductions', pmtCalcTaxDeductions)
    intentMap.set(
      'pmt-calc-unknown-tax-deductions',
      pmtCalcUnknownTaxDeductions
    )
    intentMap.set('pmt-calc-ss-deductions', pmtCalcSSDeductions)
    intentMap.set('pmt-calc-unknown-ss-deductions', pmtCalcUnknownSSDeductions)
    intentMap.set(
      'pmt-calc-retirement-contributions',
      pmtCalcRetirementContributions
    )
    intentMap.set(
      'pmt-calc-retirement-contributions-amount',
      pmtCalcRetirementContributionsAmount
    )
    intentMap.set(
      'pmt-calc-unknown-retirement-contributions',
      pmtCalcUnknownRetirementContributions
    )
    intentMap.set('pmt-calc-child-support', pmtCalcChildSupport)
    intentMap.set(
      'pmt-calc-child-support-no-retirement',
      pmtCalcChildSupportNoRetirement
    )
    intentMap.set('pmt-calc-child-support-amount', pmtCalcChildSupportAmount)
    intentMap.set(
      'pmt-calc-unknown-other-child-support',
      pmtCalcUnknownOtherChildSupport
    )
    intentMap.set('pmt-calc-unknown-deductions', pmtCalcUnknownDeductions)
    intentMap.set('pmt-calc-final-estimation', pmtCalcFinalEstimation)
    intentMap.set(
      'pmt-calc-final-estimation-no-other-children',
      pmtCalcFinalEstimationNoOtherChildren
    )

    // IWO intents
    intentMap.set('iwo-root', iwoRoot)
    intentMap.set('iwo-faqs', iwoFAQs)
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
    intentMap.set('iwo-employer-obligation', iwoEmployerObligation)
    intentMap.set('iwo-when-to-begin', iwoWhenToBegin)
    intentMap.set('iwo-how-long-to-send', iwoHowLongToSend)
    intentMap.set('iwo-employer-submit-payments', iwoEmployerSubmitPayments)
    intentMap.set('iwo-payments-handoff', iwoPaymentsHandoff)
    intentMap.set('iwoQA-arrears-balance', iwoQAArrearsBalance)

    // General payment intents
    intentMap.set('pmts-general-root', pmtsGeneralRoot)
    intentMap.set('pmts-general-non-custodial', pmtsGeneralNonCustodial)
    intentMap.set('pmts-general-make-payments', pmtsGeneralMakePayments)
    intentMap.set('pmts-general-receive-payments', pmtsGeneralReceivePayments)

    // Employer intents
    intentMap.set('employer-root', employerRoot)
    intentMap.set('employer-eft', employerEFT)
    intentMap.set('employer-iPayOnline', employerIPayOnline)
    intentMap.set('employer-checksMoneyOrders', employerChecksMoneyOrders)
    intentMap.set('employer-iwo-handoff', employerIWOHandoff)

    // Payment methods intents
    intentMap.set('pmtMethods-none', pmtMethodsNone)
    intentMap.set('pmtMethods-checkOrMoneyOrder', pmtMethodsCheckOrMoneyOrder)
    intentMap.set('pmtMethods-cash', pmtMethodsCash)
    intentMap.set('pmtMethods-eCheckDebit', pmtMethodsEcheckDebit)
    intentMap.set('pmtMethods-moneygram', pmtMethodsMoneygram)
    intentMap.set('pmtMethods-paynearme', pmtMethodsPayNearMe)
    intentMap.set('pmtMethods-cant-make', pmtMethodsCantMake)
    intentMap.set('pmtMethods-debit-card', pmtMethodsDebitCard)
    intentMap.set('pmtMethods-withhold-payments', pmtMethodsNCPWithhold)
    intentMap.set(
      'pmtMethods-cant-make-qualifying',
      pmtMethodsCantMakeQualifying
    )
    intentMap.set(
      'pmtMethods-cant-make-qualifying-help',
      pmtMethodsCantMakeQualifyingHelp
    )
    intentMap.set(
      'pmtMethods-cant-make-qualifying-no-help',
      pmtMethodsCantMakeQualifyingNoHelp
    )

    // Open a Child Support Case
    intentMap.set('open-csc-root', openCSCRoot)
    intentMap.set('open-csc-full-services', openCSCFullServices)
    intentMap.set('open-csc-select-form', openCSCSelectForm)
    intentMap.set('open-csc-location-services', openCSCLocationServices)
    intentMap.set('open-csc-employer-payments', openCSCCollectionEmployer)
    intentMap.set('open-csc-no-service', openCSCNoService)

    // Open a Child Support Case
    intentMap.set('close-cscQA-close-case', closeCSCQACloseCase)

    // Appointment intents
    intentMap.set('appts-root', apptsRoot)
    intentMap.set('appts-schedule', apptsSchedule)
    intentMap.set('appts-no-contacted', apptsNoContacted)
    intentMap.set('appts-yes-contacted', apptsYesContacted)
    intentMap.set('appts-office-locations-handoff', apptsOfficeLocationsHandoff)
    intentMap.set('appts-guidelines', apptsGuidelines)
    intentMap.set('apptsQA-office-hours', apptsQAOfficeHours)
    intentMap.set('apptsQA-missed-appt', apptsQAMissedAppt)

    // Support intents
    intentMap.set('support-root', supportRoot)
    intentMap.set('support-restart', supportRestart)
    intentMap.set('support-parent-receiving', supportParentReceiving)
    intentMap.set('support-parent-paying', supportParentPaying)
    intentMap.set('support-employer', supportEmployer)
    intentMap.set('support-parent-paying-more', supportParentPayingMore)
    intentMap.set('support-parent-receiving-more', supportParentReceivingMore)
    intentMap.set('support-no-options-selected', supportNoOptionsSelected)
    intentMap.set('support-employment-status', supportEmploymentStatus)
    intentMap.set(
      'support-handle-employment-status',
      supportHandleEmploymentStatus
    )
    intentMap.set(
      'support-collect-new-employer-name',
      supportCollectNewEmployerName
    )
    intentMap.set('support-no-new-employer', supportNoNewEmployer)
    intentMap.set(
      'support-new-employer-unknown-phone',
      supportNewEmployerUnkownPhone
    )
    intentMap.set(
      'support-collect-new-employer-phone',
      supportCollectNewEmployerPhone
    )
    intentMap.set('support-type', supportType)
    intentMap.set('support-collect-company-name', supportCollectCompanyName)
    intentMap.set('support-collect-name', supportCollectName)
    intentMap.set('support-collect-first-name', supportCollectFirstName)
    intentMap.set('support-collect-last-name', supportCollectLastName)
    intentMap.set('support-phone-number', supportPhoneNumber)
    intentMap.set('support-no-phone-number', supportNoPhoneNumber)
    intentMap.set('support-email', supportEmail)
    intentMap.set('support-no-email', supportNoEmail)
    intentMap.set('support-retry-email', supportRetryEmail)
    intentMap.set('support-handle-email-retry', supportHandleEmailRetry)
    intentMap.set('support-retry-phone-number', supportRetryPhoneNumber)
    intentMap.set('support-handle-phone-retry', supportHandlePhoneRetry)
    intentMap.set('support-case-number', supportCaseNumber)
    intentMap.set('support-no-case-number', supportNoCaseNumber)
    intentMap.set('support-collect-issue', supportCollectIssue)
    intentMap.set('support-summarize-issue', supportSummarizeIssue)
    intentMap.set('support-revise-issue', supportReviseIssue)
    intentMap.set('support-submit-issue', supportSumbitIssue)

    // Case specific intents
    intentMap.set('caseQA-increase-review', caseQAIncreaseReview)
    intentMap.set('caseQA-general', caseQAGeneral)
    intentMap.set('caseQA-general-support-request', caseQAGeneralSupportRequest)
    intentMap.set('caseQA-change-personal-info', caseQAChangePersonalInfo)
    intentMap.set('caseQA-compliance', caseQACompliance)
    intentMap.set(
      'caseQA-compliance-support-request',
      caseQAComplianceSupportRequest
    )

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

    // Feedback intents
    intentMap.set('feedback-root', feedbackRoot)
    intentMap.set('feedback-helpful', feedbackHelpful)
    intentMap.set('feedback-not-helpful', feedbackNotHelpful)
    intentMap.set('feedback-complete', feedbackComplete)

    // Genetic Testing intents
    intentMap.set('geneticTesting-request', geneticTestingRequest)
    intentMap.set('geneticTesting-results', geneticTestingResults)

    // Payments QA intents
    intentMap.set('pmtQA-havent-received', pmtQAHaventReceived)
    intentMap.set('pmtQA-payment-reduction', pmtQAPaymentReduction)
    intentMap.set('pmtQA-yes-payment-reduction', pmtQAYesPaymentReduction)
    intentMap.set('pmtQA-over-21', pmtQAOver21)
    intentMap.set('pmtQA-over-21-submit-request', pmtQAOver21SubmitRequest)
    intentMap.set('pmtQA-employer-payment-status', pmtQAEmployerPaymentStatus)
    intentMap.set(
      'pmtQA-yes-employer-payment-status',
      pmtQAYesEmployerPaymentStatus
    )
    intentMap.set('pmtQA-NCP-payment-status', pmtQANCPPaymentStatus)
    intentMap.set(
      'pmtQA-NCP-payment-status-submit-request',
      pmtQANCPPaymentStatusSubmitRequest
    )
    // Support QA intents
    intentMap.set('support-qa-cp-pictureId', supportQACpPictureId)
    intentMap.set('support-qa-who-can-apply', supportQAWhoCanApply)
    intentMap.set('support-qa-other-state', supportQAOtherState)
    intentMap.set('support-qa-ncp-prison', supportQANcpPrison)

    // Emancipation QA intents
    intentMap.set('emancipation-qa-age', emancipationAge)

    // Contact QA intents
    intentMap.set('contact-qa-number', contactQANumber)

    // Enforcement intents
    intentMap.set('enforcement-root', enforcementRoot)
    intentMap.set(
      'enforcement-license-suspension-and-reinstatement',
      enforcementLicenseSuspensionReinstatement
    )
    intentMap.set(
      'enforcement-license-suspension',
      enforcementLicenseSuspension
    )
    intentMap.set(
      'enforcement-license-suspension-non-compliance',
      enforcementLicenseSuspensionNonCompliance
    )
    intentMap.set(
      'enforcement-license-reinstatement',
      enforcementLicenseReinstatement
    )
    intentMap.set('enforcement-tax-offset', enforcementTaxOffset)
    intentMap.set('enforcement-liens', enforcementLiens)
    intentMap.set('enforcement-contest-lien', enforcementContestLien)
    intentMap.set(
      'enforcement-financial-account-update-case',
      enforcementFinancialAccountUpdateCase
    )
    intentMap.set('enforcement-personal-injury', enforcementPersonalInjury)
    intentMap.set(
      'enforcement-settlements-update-case',
      enforcementSettlementsUpdateCase
    )
    intentMap.set(
      'enforcement-settlements-no-update-case',
      enforcementSettlementsNoUpdateCase
    )
    intentMap.set(
      'enforcement-passport-revocation',
      enforcementPassportRevocation
    )
    intentMap.set(
      'enforcement-passport-reinstatement',
      enforcementPassportReinstatement
    )
    intentMap.set(
      'enforcement-credit-bureau-reporting',
      enforcementCreditBureauReporting
    )
    intentMap.set('enforcement-report-error', enforcementReportError)
    intentMap.set('enforcement-unemployment', enforcementUnemployment)
    intentMap.set('enforcement-submit-inquiry', enforcementSubmitInquiry)

    intentMap.set('enforcement-bankruptcy', enforcementBankruptcy)
    // Cancel intent
    intentMap.set('support-cancel', supportCancel)

    // Waiting on more information from client
    // Good cause claim intent
    // intentMap.set('good-cause-claim', goodCauseClaim)
    backIntent(agent, intentMap, 'go-back')
    agent.handleRequest(intentMap)
    // Analyze the intent
    preProcessIntent(agent, intentMap, request)
  })
