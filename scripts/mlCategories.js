exports.categoriesWithIntents = {
  accountBalance: { intent: 'pmtMethods-eCheckDebit' },
  addressingCheck: { intent: 'pmts-general-make-payments' },
  appointments: { intent: 'appts-root' },
  arrears: { intent: 'iwoQA-arrears-balance' },
  callcenterNotAnswering: { intent: 'tbd' }, // Suggest callcenter not answering
  cantMakePayments: { intent: 'pmts-general-make-payments' },
  card: { intent: 'eppi-get-card' },
  caseNumber: { intent: 'caseQA-general' },
  caseStatus: { intent: 'caseQA-general' },
  changeEmploymentInformation: { intent: 'support-root' },
  changeOfInformation: { intent: 'caseQA-change-personal-info' },
  childCare: { intent: 'tbd' }, // Suggest child care intent
  complaints: { intent: 'tbd' }, // Suggest complaints intent
  contactHuman: { intent: 'contact-qa-number' },
  documentation: { intent: 'tbd' }, // Suggest documentation intent
  email: { intent: 'tbd' }, // Suggest email intent
  emancipation: { intent: 'emancipation-qa-age' },
  enforcement: { intent: 'enforcement-root' },
  estimatePayments: { intent: 'pmt-calc-root' },
  fax: { intent: 'tbd' }, // Suggest fax intent
  gratitude: { intent: 'tbd' }, // Suggest gratitude intent
  greaterThanOneMonth: { intent: 'tbd' }, // suggest > 1 month intent
  incarceration: { intent: 'support-qa-ncp-prison' },
  infoAboutParent: { intent: 'support-root' }, // Perhaps move more specific
  insufficientResponse: { intent: 'tbd' }, // Suggest insufficient response handler
  interstate: { intent: 'tbd' }, // Suggest interstate intent
  legal: { intent: 'tbd' }, // Suggest legal intent
  licenseSuspension: { intent: 'enforcement-license-suspension' },
  login: { intent: 'tbd' }, // Suggest login intent
  makePayment: { intent: 'pmts-general-make-payments' },
  notReceivedPayment: { intent: 'pmtQA-havent-received' },
  officeLocations: { intent: 'map-root' },
  onlineAction: { intent: 'tbd' }, // suggest online action intent
  openCase: { intent: 'open-csc-root' },
  paidButNotReceived: { intent: 'tbd' }, // Suggest paid but not received intent
  paternity: { intent: 'geneticTesting-request' },
  paymentHistory: { intent: 'support-root' },
  paymentModification: { intent: 'caseQA-increase-review' },
  paymentTimelines: { intent: 'tbd' }, // Need payment timelines intent
  refund: { intent: 'tbd' }, // Suggest refund intent
  snap: { intent: 'tbd' }, // Suggest snap intent
  supportInquiries: { intent: 'support-root' },
  tanf: { intent: 'tbd' }, // Suggest tanf intent
  terminate: { intent: 'support-root' },
  verification: { intent: 'tbd' }, // Suggest verification intent
  visitation: { intent: 'tbd' }, // Suggest visitation intent
}
