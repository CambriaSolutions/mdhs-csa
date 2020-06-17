// Not child support intents
const {
  notChildSupportRoot,
  handleChildSupportRetry,
  handleAcknowledgementAfterRetry,
} = require('./intentHandlers/childSupport/notChildSupport.js')

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
} = require('./intentHandlers/childSupport/enforcement.js')

// General payment intents
const {
  pmtsGeneralRoot,
  pmtsGeneralNonCustodial,
  pmtsGeneralReceivePayments,
  pmtsGeneralMakePayments,
} = require('./intentHandlers/childSupport/paymentsGeneral.js')

// Employer intents
const {
  employerRoot,
  employerEFT,
  employerIPayOnline,
  employerGuide,
  employerChecksMoneyOrders,
  employerIWOHandoff,
  employerBillsAndNotices
} = require('./intentHandlers/childSupport/employer.js')

const { calcRoot } = require('./intentHandlers/childSupport/calculator.js')

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
} = require('./intentHandlers/childSupport/paymentsCalculator.js')

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
} = require('./intentHandlers/childSupport/paymentMethods.js')

// Open Child Support Case
const {
  openCSCRoot,
  openCSCFullServices,
  openCSCSelectForm,
  openCSCLocationServices,
  openCSCCollectionEmployer,
  openCSCNoService,
} = require('./intentHandlers/childSupport/openChildSupportCase.js')

// Close Child Support Case
const { closeCSCQACloseCase } = require('./intentHandlers/childSupport/closeChildSupportCase.js')

// Case specific intents
const {
  caseQAIncreaseReview,
  caseQAGeneral,
  caseQAGeneralSupportRequest,
  caseQAChangePersonalInfo,
  caseQACompliance,
  caseQAComplianceSupportRequest,
} = require('./intentHandlers/childSupport/caseQA.js')

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
} = require('./intentHandlers/childSupport/appointments.js')

// Support intents
const {
  supportRoot,
  supportParentReceiving,
  supportParentReceivingEmploymentInfo,
  supportParentReceivingCooperation,
  supportParentReceivingCooperationQ1,
  supportParentReceivingCooperationQ2,
  supportParentReceivingCooperationQ3,
  supportParentReceivingCooperationQ4,
  supportParentReceivingCooperationQ5,
  supportParentReceivingCooperationQ6,
  supportParentPayingEmploymentInfo,
  supportParentPaying,
  supportParentReceivingMore,
  supportParentReceivingEmancipation,
  supportEmployer,
  supportGoodCause,
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
  //supportCollectName,
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
  // supportSummarizeIssue,
  // supportReviseIssue,
  supportSumbitIssue,
  supportCancel,
  supportParentsGuideCSE
} = require('./intentHandlers/childSupport/support.js')

// Map intents
const { mapRoot, mapDeliverMap } = require('./intentHandlers/childSupport/map.js')

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
} = require('./intentHandlers/childSupport/directDeposit.js')

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
} = require('./intentHandlers/childSupport/eppiCard.js')

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
} = require('./intentHandlers/childSupport/incomeWithholding.js')

// Feedback
const {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} = require('./intentHandlers/childSupport/feedback.js')

// Genetic Testing
const {
  safety
} = require('./intentHandlers/childSupport/safety.js')

// Genetic Testing
const {
  geneticTestingRequest,
  geneticTestingResults,
} = require('./intentHandlers/childSupport/geneticTesting.js')

// Support QA
const {
  supportQACpPictureId,
  supportQAWhoCanApply,
  supportQAOtherState,
  supportQANcpPrison,
} = require('./intentHandlers/childSupport/supportQA.js')

// Emancipation QA
const { emancipationAge } = require('./intentHandlers/childSupport/emancipationQA.js')

// Contact QA
const {
  contactQANumber,
  contactSupportHandoff,
  contactProvidePhoneNumber,
} = require('./intentHandlers/childSupport/contactQA.js')

// Terminate 
const { terminateRoot } = require('./intentHandlers/childSupport/terminate.js')

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
} = require('./intentHandlers/childSupport/paymentsQA.js')

// Stimulus Check
const { stimulusCheck } = require('./intentHandlers/childSupport/stimulusCheck.js')

// Account information
const { accountInformation } = require('./intentHandlers/childSupport/accountInformation.js')

// Childcare
const { childCare } = require('./intentHandlers/childSupport/childCare.js')

// Documentation
const { documentation } = require('./intentHandlers/childSupport/documentation.js')

// Email
const { email } = require('./intentHandlers/childSupport/email.js')

// Fax
const { fax } = require('./intentHandlers/childSupport/fax.js')

// Fee
const { fee } = require('./intentHandlers/childSupport/fee.js')

// Gratitude not answering
const { gratitude } = require('./intentHandlers/childSupport/gratitude.js')

// Interstate
const { interstate } = require('./intentHandlers/childSupport/interstate.js')

// Legal
const { legal } = require('./intentHandlers/childSupport/legal.js')

// Login
const { login } = require('./intentHandlers/childSupport/login.js')

// Online action
const { onlineAction } = require('./intentHandlers/childSupport/onlineAction.js')

// Other
const { other } = require('./intentHandlers/childSupport/other.js')

// Payment Timelines
const { paymentTimelines } = require('./intentHandlers/childSupport/paymentTimelines.js')

// Phone number
const { phoneNumber } = require('./intentHandlers/childSupport/phoneNumber.js')

// Refund
const { refund } = require('./intentHandlers/childSupport/refund.js')

// Snap
const { snap } = require('./intentHandlers/childSupport/snap.js')

// Tanf
const { tanf } = require('./intentHandlers/childSupport/tanf.js')

// Taxes
const { taxes } = require('./intentHandlers/childSupport/taxes.js')

// Verification
const { verification } = require('./intentHandlers/childSupport/verification.js')

// Visitation
const {
  visitationRoot,
  visitationPetitionToCite,
  visitationProSePacket,
  visitationLegalServices
} = require('./intentHandlers/childSupport/visitation.js')

module.exports = {
  // Contact number intents
  'csa-contact-support-handoff': contactSupportHandoff,
  'csa-contact-provide-phone-number': contactProvidePhoneNumber,

  // Terminate intents
  'csa-terminate-root': terminateRoot,

  // Not child support intents
  'not-child-support-root': notChildSupportRoot,
  'csa-handle-child-support-retry': handleChildSupportRetry,
  'csa-acknowledgement-after-retry': handleAcknowledgementAfterRetry,

  'csa-calc-root': calcRoot,

  // Payment calculation intents
  'csa-pmt-calc-root': pmtCalcRoot,
  'csa-pmt-calc-restart': pmtCalcRootRestart,
  'csa-pmt-calc-num-children': pmtCalcNumChildren,
  'csa-pmt-calc-income-term': pmtCalcIncomeTerm,
  'csa-pmt-calc-unknown-income': pmtCalcUnknownIncome,
  'csa-pmt-calc-gross-income': pmtCalcGrossIncome,
  'csa-pmt-calc-tax-deductions': pmtCalcTaxDeductions,
  'csa-pmt-calc-unknown-tax-deductions': pmtCalcUnknownTaxDeductions,
  'csa-pmt-calc-ss-deductions': pmtCalcSSDeductions,
  'csa-pmt-calc-unknown-ss-deductions': pmtCalcUnknownSSDeductions,
  'csa-pmt-calc-retirement-contributions': pmtCalcRetirementContributions,
  'csa-pmt-calc-retirement-contributions-amount': pmtCalcRetirementContributionsAmount,
  'csa-pmt-calc-unknown-retirement-contributions': pmtCalcUnknownRetirementContributions,
  'csa-pmt-calc-child-support': pmtCalcChildSupport,
  'csa-pmt-calc-child-support-no-retirement': pmtCalcChildSupportNoRetirement,
  'csa-pmt-calc-child-support-amount': pmtCalcChildSupportAmount,
  'csa-pmt-calc-unknown-other-child-support': pmtCalcUnknownOtherChildSupport,
  'csa-pmt-calc-unknown-deductions': pmtCalcUnknownDeductions,
  'csa-pmt-calc-final-estimation': pmtCalcFinalEstimation,

  'csa-pmt-calc-final-estimation-no-other-children': pmtCalcFinalEstimationNoOtherChildren,

  // IWO intents
  'csa-iwo-root': iwoRoot,
  'csa-iwo-ccpa-root': iwoCcpaRoot,
  'csa-iwo-faqs': iwoFAQs,
  'csa-iwo-wants-assistance': iwoWantsAssistance,
  'csa-iwo-no-assistance': iwoNoAssistance,
  'csa-iwo-is-supporting': iwoIsSupporting,
  'csa-iwo-in-arrears': iwoInArrears,
  'csa-iwo-confirm-estimate': iwoConfirmEstimate,
  'csa-iwo-request-disposable-income': iwoRequestDisposableIncome,
  'csa-iwo-define-disposable-income': iwoDefineDisposableIncome,
  'csa-iwo-disposable-income': iwoDisposableIncome,
  'csa-iwo-where-to-submit': iwoWhereToSubmit,
  'csa-iwo-administrative-fee': iwoAdministrativeFee,
  'csa-iwo-other-garnishments': iwoOtherGarnishments,
  'csa-iwo-other-state': iwoOtherState,
  'csa-iwo-insurance-coverage': iwoInsuranceCoverage,
  'csa-iwo-not-an-employee': iwoNotAnEmployee,
  'csa-iwo-fire-employee': iwoFireEmployee,
  'csa-iwo-employer-obligation': iwoEmployerObligation,
  'csa-iwo-when-to-begin': iwoWhenToBegin,
  'csa-iwo-how-long-to-send': iwoHowLongToSend,
  'csa-iwo-employer-submit-payments': iwoEmployerSubmitPayments,
  'csa-iwo-payments-handoff': iwoPaymentsHandoff,
  'csa-iwoQA-arrears-balance': iwoQAArrearsBalance,

  // General payment intents
  'csa-pmts-general-root': pmtsGeneralRoot,
  'csa-pmts-general-non-custodial': pmtsGeneralNonCustodial,
  'csa-pmts-general-make-payments': pmtsGeneralMakePayments,
  'csa-pmts-general-receive-payments': pmtsGeneralReceivePayments,

  // Employer intents
  'csa-employer-root': employerRoot,
  'csa-employer-eft': employerEFT,
  'csa-employer-iPayOnline': employerIPayOnline,
  'csa-employer-guide': employerGuide,
  'csa-employer-checksMoneyOrders': employerChecksMoneyOrders,
  'csa-employer-iwo-handoff': employerIWOHandoff,
  'csa-employer-billsAndNotices': employerBillsAndNotices,

  // Payment methods intents
  'csa-account-balance': pmtMethodsEcheckDebit,
  'csa-pmtMethods-none': pmtMethodsNone,
  'csa-pmtMethods-checkOrMoneyOrder': pmtMethodsCheckOrMoneyOrder,
  'csa-pmtMethods-cash': pmtMethodsCash,
  'csa-pmtMethods-eCheckDebit': pmtMethodsEcheckDebit,
  'csa-pmtMethods-mail-address': pmtMethodsMailAddress,
  'csa-pmtMethods-moneygram': pmtMethodsMoneygram,
  'csa-pmtMethods-paynearme': pmtMethodsPayNearMe,
  'csa-pmtMethods-cant-make': pmtMethodsCantMake,
  'csa-pmtMethods-debit-card': pmtMethodsDebitCard,
  'csa-pmtMethods-withhold-payments': pmtMethodsNCPWithhold,
  'csa-pmtMethods-cant-make-qualifying': pmtMethodsCantMakeQualifying,
  'csa-pmtMethods-cant-make-qualifying-help': pmtMethodsCantMakeQualifyingHelp,
  'csa-pmtMethods-cant-make-qualifying-no-help': pmtMethodsCantMakeQualifyingNoHelp,

  // Open a Child Support Case
  'csa-open-csc-root': openCSCRoot,
  'csa-open-csc-full-services': openCSCFullServices,
  'csa-open-csc-select-form': openCSCSelectForm,
  'csa-open-csc-location-services': openCSCLocationServices,
  'csa-open-csc-employer-payments': openCSCCollectionEmployer,
  'csa-open-csc-no-service': openCSCNoService,

  // Open a Child Support Case
  'csa-close-cscQA-close-case': closeCSCQACloseCase,

  // Appointment intents
  'csa-appts-root': apptsRoot,
  'csa-appts-schedule': apptsSchedule,
  'csa-appts-no-contacted': apptsNoContacted,
  'csa-appts-yes-contacted': apptsYesContacted,
  'csa-appts-office-locations-handoff': apptsOfficeLocationsHandoff,
  'csa-appts-guidelines': apptsGuidelines,
  'csa-apptsQA-office-hours': apptsQAOfficeHours,
  'csa-apptsQA-missed-appt': apptsQAMissedAppt,

  // Support intents
  'csa-support-root': supportRoot,
  'csa-support-parent-receiving': supportParentReceiving,
  'csa-support-parent-receiving-emancipation': supportParentReceivingEmancipation,
  'csa-support-parent-receiving-cooperation': supportParentReceivingCooperation,
  'csa-support-parent-receiving-cooperation-q1': supportParentReceivingCooperationQ1,
  'csa-support-parent-receiving-cooperation-q2': supportParentReceivingCooperationQ2,
  'csa-support-parent-receiving-cooperation-q3': supportParentReceivingCooperationQ3,
  'csa-support-parent-receiving-cooperation-q4': supportParentReceivingCooperationQ4,
  'csa-support-parent-receiving-cooperation-q5': supportParentReceivingCooperationQ5,
  'csa-support-parent-receiving-cooperation-q6': supportParentReceivingCooperationQ6,
  'csa-support-parent-receiving-employment-info': supportParentReceivingEmploymentInfo,
  'csa-support-parent-paying': supportParentPaying,
  'csa-support-parent-paying-employment-info': supportParentPayingEmploymentInfo,
  'csa-support-employer': supportEmployer,
  'csa-support-goodCause': supportGoodCause,
  'csa-support-parent-paying-more': supportParentPayingMore,
  'csa-support-parent-receiving-more': supportParentReceivingMore,
  'csa-support-no-options-selected': supportNoOptionsSelected,
  'csa-support-employment-status': supportEmploymentStatus,
  'csa-support-handle-employment-status': supportHandleEmploymentStatus,
  'csa-support-collect-new-employer-name': supportCollectNewEmployerName,
  'csa-support-no-new-employer': supportNoNewEmployer,
  'csa-support-new-employer-unknown-phone': supportNewEmployerUnkownPhone,
  'csa-support-collect-new-employer-phone': supportCollectNewEmployerPhone,
  'csa-support-type': supportType,
  'csa-support-collect-company-name': supportCollectCompanyName,
  // 'support-collect-name': supportCollectName,
  'csa-support-collect-first-name': supportCollectFirstName,
  'csa-support-collect-last-name': supportCollectLastName,
  'csa-support-phone-number': supportPhoneNumber,
  'csa-support-no-phone-number': supportNoPhoneNumber,
  'csa-support-email': supportEmail,
  'csa-support-no-email': supportNoEmail,
  'csa-support-retry-email': supportRetryEmail,
  'csa-support-handle-email-retry': supportHandleEmailRetry,
  'csa-support-retry-phone-number': supportRetryPhoneNumber,
  'csa-support-handle-phone-retry': supportHandlePhoneRetry,
  'csa-support-case-number': supportCaseNumber,
  'csa-support-no-case-number': supportNoCaseNumber,
  'csa-support-collect-issue': supportCollectIssue,
  // 'csa-support-summarize-issue': supportSummarizeIssue,
  // 'support-revise-issue': supportReviseIssue,
  'csa-support-submit-issue': supportSumbitIssue,
  'csa-support-parentsGuideCSE': supportParentsGuideCSE,
  'csa-support-edit-provider-employment': supportEditProviderEmployment,
  'csa-support-report-provider-employment': supportReportProviderEmployment,

  // Case specific intents
  'csa-caseQA-increase-review': caseQAIncreaseReview,
  'csa-caseQA-general': caseQAGeneral,
  'csa-caseQA-general-support-request': caseQAGeneralSupportRequest,
  'csa-caseQA-change-personal-info': caseQAChangePersonalInfo,
  'csa-caseQA-compliance': caseQACompliance,
  'csa-caseQA-compliance-support-request': caseQAComplianceSupportRequest,

  // Map intents
  'csa-map-root': mapRoot,
  'csa-map-deliver-map': mapDeliverMap,

  // Direct deposit intents
  'csa-dirDep-root': dirDepRoot,
  'csa-dirDep-confirm-form': dirDepConfirmForm,
  'csa-dirDep-show-form': dirDepShowForm,
  'csa-dirDep-learn-more': dirDepLearnMore,
  'csa-dirDep-change': dirDepChange,
  'csa-dirDep-start': dirDepStart,
  'csa-dirDep-stop': dirDepStop,
  'csa-dirDep-checking': dirDepChecking,
  'csa-dirDep-savings': dirDepSavings,
  'csa-dirDep-account-term': dirDepAccountTerm,
  'csa-dirDep-take-effect': dirDepTakeEffect,
  'csa-dirDep-extra-funds': dirDepExtraFunds,
  'csa-dirDep-payment-closed-account': dirDepPaymentClosedAccount,
  'csa-dirDep-learn-more-eppicard': dirDepLearnMoreEppiCard,
  'csa-dirDep-no-learn-more-eppicard': dirDepNoLearnMoreEppiCard,

  // EppiCard intents
  'csa-eppi-root': eppiRoot,
  'csa-eppi-get-card': eppiGetCard,
  'csa-eppi-activate-card': eppiActivateCard,
  'csa-eppi-fees': eppiFees,
  'csa-eppi-notifications': eppiNotifications,
  'csa-eppi-replace-report': eppiReplaceReport,
  'csa-eppi-faq': eppiFAQ,
  'csa-eppi-payment-history': eppiPaymentHistory,
  'csa-eppi-use-card': eppiUseCard,
  'csa-eppi-withdraw-cash': eppiWithdrawCash,
  'csa-eppi-surcharge': eppiSurcharge,
  'csa-eppi-learn-more': eppiLearnMore,
  'csa-eppi-balance-denial': eppiBalanceDenial,

  // Feedback intents
  'csa-feedback-root': feedbackRoot,
  'csa-feedback-helpful': feedbackHelpful,
  'csa-feedback-not-helpful': feedbackNotHelpful,
  'csa-feedback-complete': feedbackComplete,

  // Genetic Testing intents
  'csa-geneticTesting-request': geneticTestingRequest,
  'csa-geneticTesting-results': geneticTestingResults,

  // Payments QA intents
  'csa-pmtQA-havent-received': pmtQAHaventReceived,
  'csa-pmtQA-payment-reduction': pmtQAPaymentReduction,
  'csa-pmtQA-yes-payment-reduction': pmtQAYesPaymentReduction,
  'csa-pmtQA-over-21': pmtQAOver21,
  'csa-pmtQA-over-21-submit-request': pmtQAOver21SubmitRequest,
  'csa-pmtQA-employer-payment-status': pmtQAEmployerPaymentStatus,
  'csa-pmtQA-yes-employer-payment-status': pmtQAYesEmployerPaymentStatus,
  'csa-pmtQA-NCP-payment-status': pmtQANCPPaymentStatus,
  'csa-pmtQA-NCP-payment-status-submit-request': pmtQANCPPaymentStatusSubmitRequest,

  // Support QA intents
  'csa-support-qa-cp-pictureId': supportQACpPictureId,
  'csa-support-qa-who-can-apply': supportQAWhoCanApply,
  'csa-support-qa-other-state': supportQAOtherState,
  'csa-support-qa-ncp-prison': supportQANcpPrison,

  // Emancipation QA intents
  'csa-emancipation-qa-age': emancipationAge,

  // Contact QA intents
  'csa-contact-qa-number': contactQANumber,

  // Enforcement intents
  'csa-enforcement-root': enforcementRoot,
  'csa-csa-enforcement-license-suspension-and-reinstatement': enforcementLicenseSuspensionReinstatement,
  'enforcement-license-suspension': enforcementLicenseSuspension,
  'csa-enforcement-license-suspension-non-compliance': enforcementLicenseSuspensionNonCompliance,
  'csa-enforcement-license-reinstatement': enforcementLicenseReinstatement,
  'csa-enforcement-tax-offset': enforcementTaxOffset,
  'csa-enforcement-tax-offset-q1': enforcementTaxOffsetQ1,
  'csa-enforcement-tax-offset-q2q3': enforcementTaxOffsetQ2Q3,
  'csa-enforcement-tax-offset-q4': enforcementTaxOffsetQ4,
  'csa-enforcement-tax-offset-q5': enforcementTaxOffsetQ5,
  'csa-enforcement-tax-offset-q6': enforcementTaxOffsetQ6,
  'csa-enforcement-tax-offset-q7': enforcementTaxOffsetQ7,
  'csa-enforcement-tax-offset-q8': enforcementTaxOffsetQ8,
  'csa-enforcement-tax-offset-q9': enforcementTaxOffsetQ9,
  'csa-enforcement-tax-offset-q10': enforcementTaxOffsetQ10,
  'csa-enforcement-liens': enforcementLiens,
  'csa-enforcement-contest-lien': enforcementContestLien,
  'csa-enforcement-financial-account-update-case': enforcementFinancialAccountUpdateCase,
  'csa-enforcement-personal-injury': enforcementPersonalInjury,
  'csa-enforcement-settlements-update-case': enforcementSettlementsUpdateCase,
  'csa-enforcement-settlements-no-update-case': enforcementSettlementsNoUpdateCase,
  'csa-enforcement-passport-revocation': enforcementPassportRevocation,
  'csa-enforcement-passport-reinstatement': enforcementPassportReinstatement,
  'csa-enforcement-credit-bureau-reporting': enforcementCreditBureauReporting,
  'csa-enforcement-report-error': enforcementReportError,
  'csa-enforcement-unemployment': enforcementUnemployment,
  'csa-enforcement-submit-inquiry': enforcementSubmitInquiry,
  'csa-stimulusCheck-root': stimulusCheck,
  'csa-enforcement-bankruptcy': enforcementBankruptcy,
  'csa-enforcement-contempt': enforcementContempt,
  // Cancel intent
  'csa-support-cancel': supportCancel,

  // Safety
  'csa-safety': safety,

  // Account information
  'csa-accountInformation-root': accountInformation,

  // Childcare
  'csa-childCare-root': childCare,

  // Complaints
  'csa-complaints-root': feedbackRoot,

  // Documentation
  'csa-documentation-root': documentation,

  // Email
  'csa-email-root': email,

  // Fax
  'csa-fax-root': fax,

  // Fee
  'csa-fee-root': fee,

  // Gratitude not answering
  'csa-gratitude-root': gratitude,

  // Interstate
  'csa-interstate-root': interstate,

  // Legal
  'csa-legal-root': legal,

  // Login
  'csa-login-root': login,

  // Online action
  'csa-onlineAction-root': onlineAction,

  // Other
  'csa-other-root': other,

  // Payment Timelines
  'csa-paymentTimelines-root': paymentTimelines,

  // Phone number
  'csa-phoneNumber-root': phoneNumber,

  // Refund
  'csa-refund-root': refund,

  // Snap
  'csa-snap-root': snap,

  // Tanf
  'csa-tanf-root': tanf,

  // Taxes
  'csa-taxes-root': taxes,

  // Verification
  'csa-verification-root': verification,

  // Visitation
  'csa-visitation-root': visitationRoot,
  'csa-visitation-petitiontocite': visitationPetitionToCite,
  'csa-visitation-prosepackets': visitationProSePacket,
  'csa-visitation-legalservices': visitationLegalServices,
}