const {
  startRootConversation,
  caseyHandoff,
  tbd
} = require('../intentHandlers/globalFunctions.js')

// Not child support intents
const {
  notChildSupportRoot,
  handleChildSupportRetry,
  handleAcknowledgementAfterRetry,
} = require('../intentHandlers/notChildSupport.js')

// General enforcement intents
const {
  enforcementRoot,
  enforcementLicenseSuspensionReinstatement,
  enforcementLicenseSuspension,
  enforcementLicenseSuspensionNonCompliance,
  enforcementLicenseReinstatement,
  enforcementTaxOffset,
  enforcementTaxOffsetQ1,
  enforcementTaxOffsetQ2Q3,
  enforcementTaxOffsetQ4,
  enforcementTaxOffsetQ5,
  enforcementTaxOffsetQ6,
  enforcementTaxOffsetQ7,
  enforcementTaxOffsetQ8,
  enforcementTaxOffsetQ9,
  enforcementTaxOffsetQ10,
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
  enforcementContempt
} = require('../intentHandlers/enforcement.js')

// General payment intents
const {
  pmtsGeneralRoot,
  pmtsGeneralNonCustodial,
  pmtsGeneralReceivePayments,
  pmtsGeneralMakePayments,
} = require('../intentHandlers/paymentsGeneral.js')

// Employer intents
const {
  employerRoot,
  employerEFT,
  employerIPayOnline,
  employerGuide,
  employerChecksMoneyOrders,
  employerIWOHandoff,
  employerBillsAndNotices
} = require('../intentHandlers/employer.js')

const { calcRoot } = require('../intentHandlers/calculator.js')

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
} = require('../intentHandlers/paymentsCalculator.js')

// Payment methods intents
const {
  pmtMethodsNone,
  pmtMethodsCheckOrMoneyOrder,
  pmtMethodsCash,
  pmtMethodsEcheckDebit,
  pmtMethodsMailAddress,
  pmtMethodsMoneygram,
  pmtMethodsPayNearMe,
  pmtMethodsCantMake,
  pmtMethodsCantMakeQualifying,
  pmtMethodsCantMakeQualifyingHelp,
  pmtMethodsCantMakeQualifyingNoHelp,
  pmtMethodsDebitCard,
  pmtMethodsNCPWithhold,
} = require('../intentHandlers/paymentMethods.js')

// Open Child Support Case
const {
  openCSCRoot,
  openCSCFullServices,
  openCSCSelectForm,
  openCSCLocationServices,
  openCSCCollectionEmployer,
  openCSCNoService,
} = require('../intentHandlers/openChildSupportCase.js')

// Close Child Support Case
const { closeCSCQACloseCase } = require('../intentHandlers/closeChildSupportCase.js')

// Case specific intents
const {
  caseQAIncreaseReview,
  caseQAGeneral,
  caseQAGeneralSupportRequest,
  caseQAChangePersonalInfo,
  caseQACompliance,
  caseQAComplianceSupportRequest,
} = require('../intentHandlers/caseQA.js')

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
} = require('../intentHandlers/appointments.js')

// Support intents
const {
  supportRoot,
  supportParentReceiving,
  supportParentReceivingEmploymentInfo,
  supportParentPayingEmploymentInfo,
  supportParentPaying,
  supportParentReceivingMore,
  supportParentReceivingEmancipation,
  supportEmployer,
  supportParentPayingMore,
  supportNoOptionsSelected,
  supportEditProviderEmployment,
  supportReportProviderEmployment,
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
  supportParentsGuideCSE
} = require('../intentHandlers/support.js')

// Map intents
const { mapRoot, mapDeliverMap } = require('../intentHandlers/map.js')

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
} = require('../intentHandlers/directDeposit.js')

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
} = require('../intentHandlers/eppiCard.js')

// IWO intents
const {
  iwoRoot,
  iwoCcpaRoot,
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
} = require('../intentHandlers/incomeWithholding.js')

// Feedback
const {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} = require('../intentHandlers/feedback.js')

// Genetic Testing
const {
  geneticTestingRequest,
  geneticTestingResults,
} = require('../intentHandlers/geneticTesting.js')

// Support QA
const {
  supportQACpPictureId,
  supportQAWhoCanApply,
  supportQAOtherState,
  supportQANcpPrison,
} = require('../intentHandlers/supportQA.js')

// Emancipation QA
const { emancipationAge } = require('../intentHandlers/emancipationQA.js')

// Contact QA
const {
  contactQANumber,
  contactSupportHandoff,
  contactProvidePhoneNumber,
} = require('../intentHandlers/contactQA.js')

// Terminate 
const { terminateRoot } = require('../intentHandlers/terminate.js')

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
} = require('../intentHandlers/paymentsQA.js')

// Stimulus Check
const { stimulusCheck } = require('../intentHandlers/stimulusCheck.js')

// Gratitude not answering
const { gratitude } = require('../intentHandlers/gratitude.js')

// Snap
const { snap } = require('../intentHandlers/snap.js')

// Visitation
const {
  visitationRoot,
  visitationPetitionToCite,
  visitationProSePacket,
  visitationLegalServices
} = require('../intentHandlers/visitation.js')

const { backIntent } = require('../intentHandlers/back.js')

const { home } = require('../intentHandlers/home')

const { welcome } = require('../intentHandlers/welcome.js')

const { fallback } = require('../intentHandlers/fallback.js')

const { yesChildSupport } = require('../intentHandlers/yesChildSupport.js')

// TODO: uncomment for ml integration
// ML model requests
const { handleUnhandled, noneOfThese } = require('../intentHandlers/categorizeAndPredict.js')

exports.buildIntentMap = () => {
  let intentMap = new Map()

  intentMap.set('Default Fallback Intent', fallback)
  intentMap.set('Default Welcome Intent', welcome)
  intentMap.set('acknowledge-privacy-statement', startRootConversation)
  intentMap.set('global-restart', startRootConversation)
  intentMap.set('restart-conversation', startRootConversation)
  intentMap.set('yes-child-support', yesChildSupport)
  intentMap.set('casey-handoff', caseyHandoff)

  // Contact number intents
  intentMap.set('contact-support-handoff', contactSupportHandoff)
  intentMap.set('contact-provide-phone-number', contactProvidePhoneNumber)

  // Terminate intents
  intentMap.set('terminate-root', terminateRoot)

  // Not child support intents
  intentMap.set('not-child-support-root', notChildSupportRoot)
  intentMap.set('handle-child-support-retry', handleChildSupportRetry)
  intentMap.set(
    'acknowledgement-after-retry',
    handleAcknowledgementAfterRetry
  )

  intentMap.set('calc-root', calcRoot);

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
  intentMap.set('iwo-ccpa-root', iwoCcpaRoot);
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
  intentMap.set('employer-guide', employerGuide)
  intentMap.set('employer-checksMoneyOrders', employerChecksMoneyOrders)
  intentMap.set('employer-iwo-handoff', employerIWOHandoff)
  intentMap.set('employer-billsAndNotices', employerBillsAndNotices)

  // Payment methods intents
  intentMap.set('pmtMethods-none', pmtMethodsNone)
  intentMap.set('pmtMethods-checkOrMoneyOrder', pmtMethodsCheckOrMoneyOrder)
  intentMap.set('pmtMethods-cash', pmtMethodsCash)
  intentMap.set('pmtMethods-eCheckDebit', pmtMethodsEcheckDebit)
  intentMap.set('pmtMethods-mail-address', pmtMethodsMailAddress)
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
  intentMap.set('support-parent-receiving', supportParentReceiving)
  intentMap.set('support-parent-receiving-emancipation', supportParentReceivingEmancipation)

  intentMap.set(
    'support-parent-receiving-employment-info',
    supportParentReceivingEmploymentInfo
  )
  intentMap.set('support-parent-paying', supportParentPaying)
  intentMap.set(
    'support-parent-paying-employment-info',
    supportParentPayingEmploymentInfo
  )
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
  intentMap.set('support-parentsGuideCSE', supportParentsGuideCSE)
  intentMap.set(
    'support-edit-provider-employment',
    supportEditProviderEmployment
  )
  intentMap.set(
    'support-report-provider-employment',
    supportReportProviderEmployment
  )

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
  intentMap.set('enforcement-tax-offset-q1', enforcementTaxOffsetQ1)
  intentMap.set('enforcement-tax-offset-q2q3', enforcementTaxOffsetQ2Q3)
  intentMap.set('enforcement-tax-offset-q4', enforcementTaxOffsetQ4)
  intentMap.set('enforcement-tax-offset-q5', enforcementTaxOffsetQ5)
  intentMap.set('enforcement-tax-offset-q6', enforcementTaxOffsetQ6)
  intentMap.set('enforcement-tax-offset-q7', enforcementTaxOffsetQ7)
  intentMap.set('enforcement-tax-offset-q8', enforcementTaxOffsetQ8)
  intentMap.set('enforcement-tax-offset-q9', enforcementTaxOffsetQ9)
  intentMap.set('enforcement-tax-offset-q10', enforcementTaxOffsetQ10)
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
  intentMap.set('stimulusCheck-root', stimulusCheck)

  intentMap.set('enforcement-bankruptcy', enforcementBankruptcy)
  intentMap.set('enforcement-contempt', enforcementContempt)
  // Cancel intent
  intentMap.set('support-cancel', supportCancel)

  // Account information
  intentMap.set('accountInformation-root', tbd)

  // Childcare
  intentMap.set('childCare-root', tbd)

  // Complaints
  intentMap.set('complaints-root', feedbackRoot)

  // Documentation
  intentMap.set('documentation-root', tbd)

  // Email
  intentMap.set('email-root', tbd)

  // Fax
  intentMap.set('fax-root', tbd)

  // Fee
  intentMap.set('fee-root', tbd)

  // Gratitude not answering
  intentMap.set('gratitude-root', gratitude)

  // Interstate
  intentMap.set('interstate-root', tbd)

  // Legal
  intentMap.set('legal-root', tbd)

  // Login
  intentMap.set('login-root', tbd)

  // Online action
  intentMap.set('onlineAction-root', tbd)

  // Other
  intentMap.set('other-root', tbd)

  // Payment Timelines
  intentMap.set('paymentTimelines-root', tbd)

  // Phone number
  intentMap.set('phoneNumber-root', tbd)

  // Refund
  intentMap.set('refund-root', tbd)

  // Snap
  intentMap.set('snap-root', snap)

  // Tanf
  intentMap.set('tanf-root', tbd)

  // Taxes
  intentMap.set('taxes-root', tbd)

  // Verification
  intentMap.set('verification-root', tbd)

  // Visitation
  intentMap.set('visitation-root', visitationRoot)
  intentMap.set('visitation-petitiontocite', visitationPetitionToCite)
  intentMap.set('visitation-prosepackets', visitationProSePacket)
  intentMap.set('visitation-legalservices', visitationLegalServices)

  intentMap.set('none-of-these', noneOfThese);
  intentMap.set('Default Fallback Intent', handleUnhandled)

  return intentMap
}