const { mapRoot } = require('./common/map.js')

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
  pmtMethodsCantMakeQualifying,
  pmtMethodsCantMakeQualifyingHelp,
  pmtMethodsCantMakeQualifyingNoHelp,
  pmtMethodsCheckOrMoneyOrder,
  pmtMethodsMailAddress
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
  caseQAComplianceSupportRequest,
} = require('./childSupport/caseQA.js')

// Appointments intents
const {
  apptsYesContacted,
  apptsOfficeLocationsHandoff,
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

// EppiCard intents
const { eppiFees } = require('./childSupport/eppiCard.js')

// IWO intents
const {
  iwoIsSupporting,
  iwoInArrears,
  iwoConfirmEstimate,
  iwoDisposableIncome,
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
  'cse-iwo-confirm-estimate': iwoConfirmEstimate,
  'cse-iwo-is-supporting': iwoIsSupporting,
  'cse-iwo-in-arrears': iwoInArrears,
  'cse-iwo-disposable-income': iwoDisposableIncome,
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
  'cse-pmtMethods-checkOrMoneyOrder': pmtMethodsCheckOrMoneyOrder,
  'cse-pmtMethods-mail-address': pmtMethodsMailAddress,
  'cse-pmtMethods-cant-make-qualifying': pmtMethodsCantMakeQualifying,
  'cse-pmtMethods-cant-make-qualifying-help': pmtMethodsCantMakeQualifyingHelp,
  'cse-pmtMethods-cant-make-qualifying-no-help': pmtMethodsCantMakeQualifyingNoHelp,

  // Open a Child Support Case
  'cse-open-csc-select-form': openCSCSelectForm,
  'cse-open-csc-no-service': openCSCNoService,

  // Open a Child Support Case
  'cse-close-cscQA-close-case': closeCSCQACloseCase,

  // Appointment intents
  'cse-appts-yes-contacted': apptsYesContacted,
  'cse-appts-office-locations-handoff': apptsOfficeLocationsHandoff,
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
  'cse-caseQA-compliance-support-request': caseQAComplianceSupportRequest,

  // EppiCard intents
  'cse-eppi-fees': eppiFees,

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

  'cse-stimulusCheck-root': stimulusCheck,
  // Cancel intent
  'cse-support-cancel': supportCancel,

  // Safety
  'cse-safety': safety,

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