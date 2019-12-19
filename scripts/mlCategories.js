exports.categoriesWithIntents = {
  accountBalance: {
    intent: 'pmtMethods-eCheckDebit',
    suggestionText: 'tbdAccountBalance',
  },
  addressingCheck: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'address check',
  },
  appointments: { intent: 'appts-root', suggestionText: 'appointments' },
  arrears: { intent: 'iwoQA-arrears-balance', suggestionText: 'arrears' },
  callcenterNotAnswering: { intent: 'tbd', suggestionText: 'tbd' }, // Suggest callcenter not answering
  cantMakePayments: {
    intent: 'pmts-general-make-payments',
    suggestionText: `can't make payments`,
  },
  card: { intent: 'eppi-get-card', suggestionText: `eppi card` },
  caseNumber: {
    intent: 'caseQA-general',
    suggestionText: 'case specific questions',
  },
  caseStatus: {
    intent: 'caseQA-general',
    suggestionText: 'case specific questions',
  },
  changeEmploymentInformation: {
    intent: 'support-root',
    suggestionText: 'case specific questions',
  },
  changeOfInformation: {
    intent: 'caseQA-change-personal-info',
    suggestionText: 'case specific questions',
  },
  childCare: { intent: 'tbd' }, // Suggest child care intent
  complaints: { intent: 'tbd' }, // Suggest complaints intent
  contactHuman: {
    intent: 'contact-qa-number',
    suggestionText: 'contact',
  },
  documentation: { intent: 'tbd' }, // Suggest documentation intent
  email: { intent: 'tbd' }, // Suggest email intent
  emancipation: {
    intent: 'emancipation-qa-age',
    suggestionText: 'emancipation',
  },
  enforcement: { intent: 'enforcement-root', suggestionText: 'enforcement' },
  estimatePayments: {
    intent: 'pmt-calc-root',
    suggestionText: 'estimate payments',
  },
  fax: { intent: 'tbd' }, // Suggest fax intent
  gratitude: { intent: 'tbd' }, // Suggest gratitude intent
  greaterThanOneMonth: { intent: 'tbd' }, // suggest > 1 month intent
  incarceration: {
    intent: 'support-qa-ncp-prison',
    suggestionText: 'incarceration',
  },
  infoAboutParent: { intent: 'support-root', suggestionText: 'support root' }, // Perhaps move more specific
  insufficientResponse: { intent: 'tbd' }, // Suggest insufficient response handler
  interstate: { intent: 'tbd' }, // Suggest interstate intent
  legal: { intent: 'tbd' }, // Suggest legal intent
  licenseSuspension: {
    intent: 'enforcement-license-suspension',
    suggestionText: 'license suspension',
  },
  login: { intent: 'tbd' }, // Suggest login intent
  makePayment: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'make payments',
  },
  notReceivedPayment: {
    intent: 'pmtQA-havent-received',
    suggestionText: `haven't received payments`,
  },
  officeLocations: { intent: 'map-root', suggestionText: 'office locations' },
  onlineAction: { intent: 'tbd' }, // suggest online action intent
  openCase: { intent: 'open-csc-root', suggestionText: 'open case' },
  paidButNotReceived: { intent: 'tbd' }, // Suggest paid but not received intent
  paternity: {
    intent: 'geneticTesting-request',
    suggestionText: 'genetic testing',
  },
  paymentHistory: { intent: 'support-root', suggestionText: 'payment history' },
  paymentModification: {
    intent: 'caseQA-increase-review',
    suggestionText: 'payment modification',
  },
  paymentTimelines: { intent: 'tbd' }, // Need payment timelines intent
  refund: { intent: 'tbd' }, // Suggest refund intent
  snap: { intent: 'tbd' }, // Suggest snap intent
  supportInquiries: {
    intent: 'support-root',
    suggestionText: 'support inquiries',
  },
  tanf: { intent: 'tbd' }, // Suggest tanf intent
  terminate: { intent: 'support-root', suggestionText: 'close case' },
  verification: { intent: 'tbd' }, // Suggest verification intent
  visitation: { intent: 'tbd' }, // Suggest visitation intent
}
