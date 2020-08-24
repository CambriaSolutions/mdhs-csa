const { mapRoot } = require('./common/map.js')

// TODO REMOVE THESE???
// Not child support intents
const {
  notChildSupportRoot,
  handleChildSupportRetry,
  handleAcknowledgementAfterRetry,
} = require('./childSupport/notChildSupport.js')

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
} = require('./childSupport/enforcement.js')

// General payment intents
const {
  pmtsGeneralRoot,
  pmtsGeneralNonCustodial,
  pmtsGeneralReceivePayments,
  pmtsGeneralMakePayments,
} = require('./childSupport/paymentsGeneral.js')

// Employer intents
const {
  employerRoot,
  employerEFT,
  employerIPayOnline,
  employerGuide,
  employerChecksMoneyOrders,
  employerIWOHandoff,
  employerBillsAndNotices
} = require('./childSupport/employer.js')

const { calcRoot } = require('./childSupport/calculator.js')

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
} = require('./childSupport/paymentsCalculator.js')

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
} = require('./childSupport/paymentMethods.js')

// Open Child Support Case
const {
  openCSCSelectForm,
  openCSCNoService,
} = require('./childSupport/openChildSupportCase.js')

// Close Child Support Case
const { closeCSCQACloseCase } = require('./childSupport/closeChildSupportCase.js')

// Case specific intents
const {
  caseQAIncreaseReview,
  caseQAGeneral,
  caseQAChangePersonalInfo,
  caseQACompliance,
  caseQAComplianceSupportRequest,
} = require('./childSupport/caseQA.js')

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
} = require('./childSupport/appointments.js')

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
  supportParentsGuideCSE,
  supportSubmitSupportRequestCooperation,
  supportSubmitSupportRequestInquiry,
  supportSubmitSupportRequestSafety,
  supportSubmitSupportRequestGoodCause,
  supportSubmitSupportRequestVerification,
  supportSubmitSupportRequestInterstate,
} = require('./childSupport/support.js')

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
} = require('./childSupport/directDeposit.js')

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
} = require('./childSupport/eppiCard.js')

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
} = require('./childSupport/incomeWithholding.js')

// Genetic Testing
const {
  safety
} = require('./childSupport/safety.js')

// Genetic Testing
const {
  geneticTestingRequest,
  geneticTestingResults,
} = require('./childSupport/geneticTesting.js')

// Support QA
const {
  supportQACpPictureId,
  supportQAWhoCanApply,
  supportQAOtherState,
  supportQANcpPrison,
} = require('./childSupport/supportQA.js')

// Emancipation QA
const { emancipationAge } = require('./childSupport/emancipationQA.js')

// Contact QA
const {
  contactQANumber,
  contactSupportHandoff,
  contactProvidePhoneNumber,
} = require('./childSupport/contactQA.js')

// Terminate 
const { terminateRoot } = require('./childSupport/terminate.js')

// Payments QA
const {
  pmtQAHaventReceived,
  pmtQAPaymentReduction,
  pmtQAYesPaymentReduction,
  pmtQAOver21,
  pmtQAEmployerPaymentStatus,
  pmtQAYesEmployerPaymentStatus,
  pmtQANCPPaymentStatus
} = require('./childSupport/paymentsQA.js')

// Stimulus Check
const { stimulusCheck } = require('./childSupport/stimulusCheck.js')

// Account information
const { accountInformation } = require('./childSupport/accountInformation.js')

// Childcare
const { childCare } = require('./childSupport/childCare.js')

// Email
const { email } = require('./childSupport/email.js')

// Fax
const { fax } = require('./childSupport/fax.js')

// Fee
const { fee } = require('./childSupport/fee.js')

// Gratitude not answering
const { gratitude } = require('./childSupport/gratitude.js')

// Legal
const { legal } = require('./childSupport/legal.js')

// Login
const { login } = require('./childSupport/login.js')

// Other
const { other } = require('./childSupport/other.js')

// Payment Timelines
const { paymentTimelines } = require('./childSupport/paymentTimelines.js')

// Phone number
const { phoneNumber } = require('./childSupport/phoneNumber.js')

// Refund
const { refund } = require('./childSupport/refund.js')

// Snap
const { snap } = require('./childSupport/snap.js')

// Tanf
const { tanf } = require('./childSupport/tanf.js')

// Verification
const { verification } = require('./childSupport/verification.js')

// Visitation
const {
  visitationRoot,
  visitationPetitionToCite,
  visitationProSePacket,
  visitationLegalServices
} = require('./childSupport/visitation.js')

module.exports = {
  // Contact number intents
  'cse-contact-support-handoff': contactSupportHandoff,
  'cse-contact-provide-phone-number': contactProvidePhoneNumber,

  // Terminate intents
  'cse-terminate-root': terminateRoot,

  // Not child support intents
  'not-child-support-root': notChildSupportRoot,
  'cse-handle-child-support-retry': handleChildSupportRetry,
  'cse-acknowledgement-after-retry': handleAcknowledgementAfterRetry,

  'cse-calc-root': calcRoot,

  // Payment calculation intents
  'cse-pmt-calc-root': pmtCalcRoot,
  'cse-pmt-calc-restart': pmtCalcRootRestart,
  'cse-pmt-calc-num-children': pmtCalcNumChildren,
  'cse-pmt-calc-income-term': pmtCalcIncomeTerm,
  'cse-pmt-calc-unknown-income': pmtCalcUnknownIncome,
  'cse-pmt-calc-gross-income': pmtCalcGrossIncome,
  'cse-pmt-calc-tax-deductions': pmtCalcTaxDeductions,
  'cse-pmt-calc-unknown-tax-deductions': pmtCalcUnknownTaxDeductions,
  'cse-pmt-calc-ss-deductions': pmtCalcSSDeductions,
  'cse-pmt-calc-unknown-ss-deductions': pmtCalcUnknownSSDeductions,
  'cse-pmt-calc-retirement-contributions': pmtCalcRetirementContributions,
  'cse-pmt-calc-retirement-contributions-amount': pmtCalcRetirementContributionsAmount,
  'cse-pmt-calc-unknown-retirement-contributions': pmtCalcUnknownRetirementContributions,
  'cse-pmt-calc-child-support': pmtCalcChildSupport,
  'cse-pmt-calc-child-support-no-retirement': pmtCalcChildSupportNoRetirement,
  'cse-pmt-calc-child-support-amount': pmtCalcChildSupportAmount,
  'cse-pmt-calc-unknown-other-child-support': pmtCalcUnknownOtherChildSupport,
  'cse-pmt-calc-unknown-deductions': pmtCalcUnknownDeductions,
  'cse-pmt-calc-final-estimation': pmtCalcFinalEstimation,

  'cse-pmt-calc-final-estimation-no-other-children': pmtCalcFinalEstimationNoOtherChildren,

  // IWO intents
  'cse-iwo-root': iwoRoot,
  'cse-iwo-ccpa-root': iwoCcpaRoot,
  'cse-iwo-faqs': iwoFAQs,
  'cse-iwo-wants-assistance': iwoWantsAssistance,
  'cse-iwo-no-assistance': iwoNoAssistance,
  'cse-iwo-is-supporting': iwoIsSupporting,
  'cse-iwo-in-arrears': iwoInArrears,
  'cse-iwo-confirm-estimate': iwoConfirmEstimate,
  'cse-iwo-request-disposable-income': iwoRequestDisposableIncome,
  'cse-iwo-define-disposable-income': iwoDefineDisposableIncome,
  'cse-iwo-disposable-income': iwoDisposableIncome,
  'cse-iwo-where-to-submit': iwoWhereToSubmit,
  'cse-iwo-administrative-fee': iwoAdministrativeFee,
  'cse-iwo-other-garnishments': iwoOtherGarnishments,
  'cse-iwo-other-state': iwoOtherState,
  'cse-iwo-insurance-coverage': iwoInsuranceCoverage,
  'cse-iwo-not-an-employee': iwoNotAnEmployee,
  'cse-iwo-fire-employee': iwoFireEmployee,
  'cse-iwo-employer-obligation': iwoEmployerObligation,
  'cse-iwo-when-to-begin': iwoWhenToBegin,
  'cse-iwo-how-long-to-send': iwoHowLongToSend,
  'cse-iwo-employer-submit-payments': iwoEmployerSubmitPayments,
  'cse-iwo-payments-handoff': iwoPaymentsHandoff,
  'cse-iwoQA-arrears-balance': iwoQAArrearsBalance,

  // General payment intents
  'cse-pmts-general-root': pmtsGeneralRoot,
  'cse-pmts-general-non-custodial': pmtsGeneralNonCustodial,
  'cse-pmts-general-make-payments': pmtsGeneralMakePayments,
  'cse-pmts-general-receive-payments': pmtsGeneralReceivePayments,

  // Employer intents
  'cse-employer-root': employerRoot,
  'cse-employer-eft': employerEFT,
  'cse-employer-iPayOnline': employerIPayOnline,
  'cse-employer-guide': employerGuide,
  'cse-employer-checksMoneyOrders': employerChecksMoneyOrders,
  'cse-employer-iwo-handoff': employerIWOHandoff,
  'cse-employer-billsAndNotices': employerBillsAndNotices,

  // Payment methods intents
  'cse-account-balance': pmtMethodsEcheckDebit,
  'cse-pmtMethods-none': pmtMethodsNone,
  'cse-pmtMethods-checkOrMoneyOrder': pmtMethodsCheckOrMoneyOrder,
  'cse-pmtMethods-cash': pmtMethodsCash,
  'cse-pmtMethods-eCheckDebit': pmtMethodsEcheckDebit,
  'cse-pmtMethods-mail-address': pmtMethodsMailAddress,
  'cse-pmtMethods-moneygram': pmtMethodsMoneygram,
  'cse-pmtMethods-paynearme': pmtMethodsPayNearMe,
  'cse-pmtMethods-cant-make': pmtMethodsCantMake,
  'cse-pmtMethods-debit-card': pmtMethodsDebitCard,
  'cse-pmtMethods-withhold-payments': pmtMethodsNCPWithhold,
  'cse-pmtMethods-cant-make-qualifying': pmtMethodsCantMakeQualifying,
  'cse-pmtMethods-cant-make-qualifying-help': pmtMethodsCantMakeQualifyingHelp,
  'cse-pmtMethods-cant-make-qualifying-no-help': pmtMethodsCantMakeQualifyingNoHelp,

  // Open a Child Support Case
  'cse-open-csc-select-form': openCSCSelectForm,
  'cse-open-csc-no-service': openCSCNoService,

  // Open a Child Support Case
  'cse-close-cscQA-close-case': closeCSCQACloseCase,

  // Appointment intents
  'cse-appts-root': apptsRoot,
  'cse-appts-schedule': apptsSchedule,
  'cse-appts-no-contacted': apptsNoContacted,
  'cse-appts-yes-contacted': apptsYesContacted,
  'cse-appts-office-locations-handoff': apptsOfficeLocationsHandoff,
  'cse-appts-guidelines': apptsGuidelines,
  'cse-apptsQA-office-hours': apptsQAOfficeHours,
  'cse-apptsQA-missed-appt': apptsQAMissedAppt,

  // Support intents
  'cse-support-root': supportRoot,
  'cse-support-parent-receiving': supportParentReceiving,
  'cse-support-parent-receiving-emancipation': supportParentReceivingEmancipation,
  'cse-support-parent-receiving-cooperation': supportParentReceivingCooperation,
  'cse-support-parent-receiving-cooperation-q1': supportParentReceivingCooperationQ1,
  'cse-support-parent-receiving-cooperation-q2': supportParentReceivingCooperationQ2,
  'cse-support-parent-receiving-cooperation-q3': supportParentReceivingCooperationQ3,
  'cse-support-parent-receiving-cooperation-q4': supportParentReceivingCooperationQ4,
  'cse-support-parent-receiving-cooperation-q5': supportParentReceivingCooperationQ5,
  'cse-support-parent-receiving-cooperation-q6': supportParentReceivingCooperationQ6,
  'cse-support-parent-receiving-employment-info': supportParentReceivingEmploymentInfo,
  'cse-support-parent-paying': supportParentPaying,
  'cse-support-parent-paying-employment-info': supportParentPayingEmploymentInfo,
  'cse-support-employer': supportEmployer,
  'cse-support-goodCause': supportGoodCause,
  'cse-support-parent-paying-more': supportParentPayingMore,
  'cse-support-parent-receiving-more': supportParentReceivingMore,
  'cse-support-no-options-selected': supportNoOptionsSelected,
  'cse-support-employment-status': supportEmploymentStatus,
  'cse-support-handle-employment-status': supportHandleEmploymentStatus,
  'cse-support-collect-new-employer-name': supportCollectNewEmployerName,
  'cse-support-no-new-employer': supportNoNewEmployer,
  'cse-support-new-employer-unknown-phone': supportNewEmployerUnkownPhone,
  'cse-support-collect-new-employer-phone': supportCollectNewEmployerPhone,
  'cse-support-type': supportType,
  'cse-support-collect-company-name': supportCollectCompanyName,
  // 'support-collect-name': supportCollectName,
  'cse-support-collect-first-name': supportCollectFirstName,
  'cse-support-collect-last-name': supportCollectLastName,
  'cse-support-phone-number': supportPhoneNumber,
  'cse-support-no-phone-number': supportNoPhoneNumber,
  'cse-support-email': supportEmail,
  'cse-support-no-email': supportNoEmail,
  'cse-support-retry-email': supportRetryEmail,
  'cse-support-handle-email-retry': supportHandleEmailRetry,
  'cse-support-retry-phone-number': supportRetryPhoneNumber,
  'cse-support-handle-phone-retry': supportHandlePhoneRetry,
  'cse-support-case-number': supportCaseNumber,
  'cse-support-no-case-number': supportNoCaseNumber,
  'cse-support-collect-issue': supportCollectIssue,
  // 'cse-support-summarize-issue': supportSummarizeIssue,
  // 'support-revise-issue': supportReviseIssue,
  'cse-support-submit-issue': supportSumbitIssue,
  'cse-support-parentsGuideCSE': supportParentsGuideCSE,
  'cse-support-edit-provider-employment': supportEditProviderEmployment,
  'cse-support-report-provider-employment': supportReportProviderEmployment,
  'cse-support-submitSupportRequest-cooperation': supportSubmitSupportRequestCooperation,
  'cse-support-submitSupportRequest-inquiry': supportSubmitSupportRequestInquiry,
  'cse-support-submitSupportRequest-safety': supportSubmitSupportRequestSafety,
  'cse-support-submitSupportRequest-goodCause': supportSubmitSupportRequestGoodCause,
  'cse-support-submitSupportRequest-verification': supportSubmitSupportRequestVerification,
  'cse-support-submitSupportRequest-interstate': supportSubmitSupportRequestInterstate,

  // Case specific intents
  'cse-caseQA-increase-review': caseQAIncreaseReview,
  'cse-caseQA-general': caseQAGeneral,
  'cse-caseQA-change-personal-info': caseQAChangePersonalInfo,
  'cse-caseQA-compliance': caseQACompliance,
  'cse-caseQA-compliance-support-request': caseQAComplianceSupportRequest,


  // Direct deposit intents
  'cse-dirDep-root': dirDepRoot,
  'cse-dirDep-confirm-form': dirDepConfirmForm,
  'cse-dirDep-show-form': dirDepShowForm,
  'cse-dirDep-learn-more': dirDepLearnMore,
  'cse-dirDep-change': dirDepChange,
  'cse-dirDep-start': dirDepStart,
  'cse-dirDep-stop': dirDepStop,
  'cse-dirDep-checking': dirDepChecking,
  'cse-dirDep-savings': dirDepSavings,
  'cse-dirDep-account-term': dirDepAccountTerm,
  'cse-dirDep-take-effect': dirDepTakeEffect,
  'cse-dirDep-extra-funds': dirDepExtraFunds,
  'cse-dirDep-payment-closed-account': dirDepPaymentClosedAccount,
  'cse-dirDep-learn-more-eppicard': dirDepLearnMoreEppiCard,
  'cse-dirDep-no-learn-more-eppicard': dirDepNoLearnMoreEppiCard,

  // EppiCard intents
  'cse-eppi-root': eppiRoot,
  'cse-eppi-get-card': eppiGetCard,
  'cse-eppi-activate-card': eppiActivateCard,
  'cse-eppi-fees': eppiFees,
  'cse-eppi-notifications': eppiNotifications,
  'cse-eppi-replace-report': eppiReplaceReport,
  'cse-eppi-faq': eppiFAQ,
  'cse-eppi-payment-history': eppiPaymentHistory,
  'cse-eppi-use-card': eppiUseCard,
  'cse-eppi-withdraw-cash': eppiWithdrawCash,
  'cse-eppi-surcharge': eppiSurcharge,
  'cse-eppi-learn-more': eppiLearnMore,
  'cse-eppi-balance-denial': eppiBalanceDenial,

  // Genetic Testing intents
  'cse-geneticTesting-request': geneticTestingRequest,
  'cse-geneticTesting-results': geneticTestingResults,

  // Payments QA intents
  'cse-pmtQA-havent-received': pmtQAHaventReceived,
  'cse-pmtQA-payment-reduction': pmtQAPaymentReduction,
  'cse-pmtQA-yes-payment-reduction': pmtQAYesPaymentReduction,
  'cse-pmtQA-over-21': pmtQAOver21,
  'cse-pmtQA-employer-payment-status': pmtQAEmployerPaymentStatus,
  'cse-pmtQA-yes-employer-payment-status': pmtQAYesEmployerPaymentStatus,
  'cse-pmtQA-NCP-payment-status': pmtQANCPPaymentStatus,

  // Support QA intents
  'cse-support-qa-cp-pictureId': supportQACpPictureId,
  'cse-support-qa-who-can-apply': supportQAWhoCanApply,
  'cse-support-qa-other-state': supportQAOtherState,
  'cse-support-qa-ncp-prison': supportQANcpPrison,

  // Emancipation QA intents
  'cse-emancipation-qa-age': emancipationAge,

  // Contact QA intents
  'cse-contact-qa-number': contactQANumber,

  // Enforcement intents
  'cse-enforcement-root': enforcementRoot,
  'cse-enforcement-license-suspension-and-reinstatement': enforcementLicenseSuspensionReinstatement,
  'cse-enforcement-license-suspension': enforcementLicenseSuspension,
  'cse-enforcement-license-suspension-non-compliance': enforcementLicenseSuspensionNonCompliance,
  'cse-enforcement-license-reinstatement': enforcementLicenseReinstatement,
  'cse-enforcement-tax-offset': enforcementTaxOffset,
  'cse-enforcement-tax-offset-q1': enforcementTaxOffsetQ1,
  'cse-enforcement-tax-offset-q2q3': enforcementTaxOffsetQ2Q3,
  'cse-enforcement-tax-offset-q4': enforcementTaxOffsetQ4,
  'cse-enforcement-tax-offset-q5': enforcementTaxOffsetQ5,
  'cse-enforcement-tax-offset-q6': enforcementTaxOffsetQ6,
  'cse-enforcement-tax-offset-q7': enforcementTaxOffsetQ7,
  'cse-enforcement-tax-offset-q8': enforcementTaxOffsetQ8,
  'cse-enforcement-tax-offset-q9': enforcementTaxOffsetQ9,
  'cse-enforcement-tax-offset-q10': enforcementTaxOffsetQ10,
  'cse-enforcement-liens': enforcementLiens,
  'cse-enforcement-contest-lien': enforcementContestLien,
  'cse-enforcement-financial-account-update-case': enforcementFinancialAccountUpdateCase,
  'cse-enforcement-personal-injury': enforcementPersonalInjury,
  'cse-enforcement-settlements-update-case': enforcementSettlementsUpdateCase,
  'cse-enforcement-settlements-no-update-case': enforcementSettlementsNoUpdateCase,
  'cse-enforcement-passport-revocation': enforcementPassportRevocation,
  'cse-enforcement-passport-reinstatement': enforcementPassportReinstatement,
  'cse-enforcement-credit-bureau-reporting': enforcementCreditBureauReporting,
  'cse-enforcement-report-error': enforcementReportError,
  'cse-enforcement-unemployment': enforcementUnemployment,
  'cse-enforcement-submit-inquiry': enforcementSubmitInquiry,
  'cse-stimulusCheck-root': stimulusCheck,
  'cse-enforcement-bankruptcy': enforcementBankruptcy,
  'cse-enforcement-contempt': enforcementContempt,
  // Cancel intent
  'cse-support-cancel': supportCancel,

  // Safety
  'cse-safety': safety,

  // Account information
  'cse-accountInformation-root': accountInformation,

  // Childcare
  'cse-childCare-root': childCare,

  // Email
  'cse-email-root': email,

  // Fax
  'cse-fax-root': fax,

  // Fee
  'cse-fee-root': fee,

  // Gratitude not answering
  'cse-gratitude-root': gratitude,

  // Legal
  'cse-legal-root': legal,

  // Login
  'cse-login-root': login,

  // Other
  'cse-other-root': other,

  // Payment Timelines
  'cse-paymentTimelines-root': paymentTimelines,

  // Phone number
  'cse-phoneNumber-root': phoneNumber,

  // Refund
  'cse-refund-root': refund,

  // Snap
  'cse-snap-root': snap,

  // Tanf
  'cse-tanf-root': tanf,

  // Verification
  'cse-verification-root': verification,

  // Visitation
  'cse-visitation-root': visitationRoot,
  'cse-visitation-petitiontocite': visitationPetitionToCite,
  'cse-visitation-prosepackets': visitationProSePacket,
  'cse-visitation-legalservices': visitationLegalServices,

  // Map
  'cse-map-root': mapRoot('cse')
}