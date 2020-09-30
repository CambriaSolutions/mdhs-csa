const { mapRoot } = require('./common/map.js')

// Payment calculator intents
const {
  pmtCalcRoot,
  pmtCalcRootRestart,
  pmtCalcIncomeTerm,
  pmtCalcGrossIncome,
  pmtCalcTaxDeductions,
  pmtCalcSSDeductions,
  pmtCalcRetirementContributions,
  pmtCalcChildSupport,
  pmtCalcChildSupportNoRetirement,
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

// Close Child Support Case
const { closeCSCQACloseCase } = require('./childSupport/closeChildSupportCase.js')

// Case specific intents
const {
  caseQAIncreaseReview,
  caseQAChangePersonalInfo,
  caseQAComplianceSupportRequest,
} = require('./childSupport/caseQA.js')

// Appointments intents
const {
  apptsOfficeLocationsHandoff,
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
  supportSubmitSupportRequestRequestPaymentHistory,
} = require('./childSupport/support.js')

// EppiCard intents
const { eppiFees } = require('./childSupport/eppiCard.js')

// IWO intents
const {
  iwoIsSupporting,
  iwoInArrears,
  iwoConfirmEstimate,
  iwoDisposableIncome,
  iwoQAArrearsBalance,
} = require('./childSupport/incomeWithholding.js')

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

// TBD
const { childCare } = require('./childSupport/childCare.js')
const { email } = require('./childSupport/email.js')
const { fax } = require('./childSupport/fax.js')
const { fee } = require('./childSupport/fee.js')
const { legal } = require('./childSupport/legal.js')
const { login } = require('./childSupport/login.js')
const { other } = require('./childSupport/other.js')
const { paymentTimelines } = require('./childSupport/paymentTimelines.js')
const { phoneNumber } = require('./childSupport/phoneNumber.js')
const { refund } = require('./childSupport/refund.js')

// Visitation
const {
  visitationRoot,
  visitationPetitionToCite,
  visitationProSePacket,
  visitationLegalServices
} = require('./childSupport/visitation.js')

module.exports = {
  'cse-account-balance': () => { },
  'cse-accountInformation-root': () => { },
  'cse-acknowledgement-after-retry': () => { },
  'cse-appts-guidelines': () => { },
  'cse-appts-no-contacted': () => { },
  'cse-appts-root': () => { },
  'cse-appts-schedule': () => { },
  'cse-apptsQA-office-hours': () => { },
  'cse-calc-root': () => { },
  'cse-caseQA-compliance': () => { },

  // Contact number intents
  'cse-contact-support-handoff': contactSupportHandoff,
  'cse-contact-provide-phone-number': contactProvidePhoneNumber,

  // Terminate intents
  'cse-terminate-root': terminateRoot,

  // Payment calculation intents
  'cse-pmt-calc-root': pmtCalcRoot,
  'cse-pmt-calc-restart': pmtCalcRootRestart,
  'cse-pmt-calc-income-term': pmtCalcIncomeTerm,
  'cse-pmt-calc-gross-income': pmtCalcGrossIncome,
  'cse-pmt-calc-tax-deductions': pmtCalcTaxDeductions,
  'cse-pmt-calc-ss-deductions': pmtCalcSSDeductions,
  'cse-pmt-calc-retirement-contributions': pmtCalcRetirementContributions,
  'cse-pmt-calc-child-support': pmtCalcChildSupport,
  'cse-pmt-calc-child-support-no-retirement': pmtCalcChildSupportNoRetirement,
  'cse-pmt-calc-final-estimation': pmtCalcFinalEstimation,

  'cse-pmt-calc-final-estimation-no-other-children': pmtCalcFinalEstimationNoOtherChildren,

  // IWO intents
  'cse-iwo-confirm-estimate': iwoConfirmEstimate,
  'cse-iwo-is-supporting': iwoIsSupporting,
  'cse-iwo-in-arrears': iwoInArrears,
  'cse-iwo-disposable-income': iwoDisposableIncome,
  'cse-iwoQA-arrears-balance': iwoQAArrearsBalance,

  // Payment methods intents
  'cse-pmtMethods-checkOrMoneyOrder': pmtMethodsCheckOrMoneyOrder,
  'cse-pmtMethods-mail-address': pmtMethodsMailAddress,
  'cse-pmtMethods-cant-make-qualifying': pmtMethodsCantMakeQualifying,
  'cse-pmtMethods-cant-make-qualifying-help': pmtMethodsCantMakeQualifyingHelp,
  'cse-pmtMethods-cant-make-qualifying-no-help': pmtMethodsCantMakeQualifyingNoHelp,

  // Open a Child Support Case
  'cse-close-cscQA-close-case': closeCSCQACloseCase,

  // Appointment intents
  'cse-appts-office-locations-handoff': apptsOfficeLocationsHandoff,

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
  'cse-support-submitSupportRequest-requestPaymentHistory': supportSubmitSupportRequestRequestPaymentHistory,

  // Case specific intents
  'cse-caseQA-increase-review': caseQAIncreaseReview,
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

  // Cancel intent
  'cse-support-cancel': supportCancel,

  // Childcare
  'cse-childCare-root': childCare,

  // Email
  'cse-email-root': email,

  // Fax
  'cse-fax-root': fax,

  // Fee
  'cse-fee-root': fee,

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

  // Visitation
  'cse-visitation-root': visitationRoot,
  'cse-visitation-petitiontocite': visitationPetitionToCite,
  'cse-visitation-prosepackets': visitationProSePacket,
  'cse-visitation-legalservices': visitationLegalServices,

  // Map
  'cse-map-root': mapRoot('cse')
}