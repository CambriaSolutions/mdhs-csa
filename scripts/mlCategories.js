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
  callcenterNotAnswering: { intent: 'callcenterNotAnswering-root', suggestionText: 'tbd (callcenterNotAnswering)' }, // Suggest callcenter not answering
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
  childCare: { intent: 'childcare-root', suggestionText: 'tbd (childCare)' }, // Suggest child care intent
  complaints: { intent: 'complaints-root', suggestionText: 'tbd (complaints)' }, // Suggest complaints intent
  contactHuman: {
    intent: 'contact-qa-number',
    suggestionText: 'contact',
  },
  documentation: { intent: 'documentation-root', suggestionText: 'tbd (documentation)' }, // Suggest documentation intent
  email: { intent: 'email-root', suggestionText: 'tbd (email)' }, // Suggest email intent
  emancipation: {
    intent: 'emancipation-qa-age',
    suggestionText: 'emancipation',
  },
  enforcement: { intent: 'enforcement-root', suggestionText: 'enforcement' },
  estimatePayments: {
    intent: 'pmt-calc-root',
    suggestionText: 'estimate payments',
  },
  fax: { intent: 'fax-root', suggestionText: 'tbd (fax)' }, // Suggest fax intent
  gratitude: { intent: 'gratitude-root', suggestionText: 'tbd (gratitude)' }, // Suggest gratitude intent
  greaterThanOneMonth: { intent: 'greaterThanOneMonth-root', suggestionText: 'tbd (greaterThanOneMonth)' }, // suggest > 1 month intent
  incarceration: {
    intent: 'support-qa-ncp-prison',
    suggestionText: 'incarceration',
  },
  infoAboutParent: { intent: 'support-root', suggestionText: 'support root' }, // Perhaps move more specific
  insufficientResponse: { intent: 'insufficientResponse-root', suggestionText: 'tbd (insufficientResponse)' }, // Suggest insufficient response handler
  interstate: { intent: 'interstate-root', suggestionText: 'tbd (interstate)' }, // Suggest interstate intent
  legal: { intent: 'legal-root', suggestionText: 'tbd (legal)' }, // Suggest legal intent
  licenseSuspension: {
    intent: 'enforcement-license-suspension',
    suggestionText: 'license suspension',
  },
  login: { intent: 'login-root', suggestionText: 'tbd (login)' }, // Suggest login intent
  makePayment: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'make payments',
  },
  notReceivedPayment: {
    intent: 'pmtQA-havent-received',
    suggestionText: `haven't received payments`,
  },
  officeLocations: { intent: 'map-root', suggestionText: 'office locations' },
  onlineAction: { intent: 'onlineAction-root', suggestionText: 'tbd (onlineAction)' }, // suggest online action intent
  openCase: { intent: 'open-csc-root', suggestionText: 'open case' },
  paidButNotReceived: { intent: 'paidButNotReceived-root', suggestionText: 'tbd (paidButNotReceived)' }, // Suggest paid but not received intent
  paternity: {
    intent: 'geneticTesting-request',
    suggestionText: 'genetic testing',
  },
  paymentHistory: { intent: 'support-root', suggestionText: 'payment history' },
  paymentModification: {
    intent: 'caseQA-increase-review',
    suggestionText: 'payment modification',
  },
  paymentTimelines: { intent: 'paymentTimelines-root', suggestionText: 'tbd (paymentTimelines)' }, // Need payment timelines intent
  refund: { intent: 'refund-root', suggestionText: 'tbd (refund)' }, // Suggest refund intent
  snap: { intent: 'snap-root', suggestionText: 'tbd (snap)' }, // Suggest snap intent
  supportInquiries: {
    intent: 'support-root',
    suggestionText: 'support inquiries',
  },
  tanf: { intent: 'tanf-root', suggestionText: 'tbd (tanf)' }, // Suggest tanf intent
  terminate: { intent: 'support-root', suggestionText: 'close case' },
  verification: { intent: 'verification-root', suggestionText: 'tbd (verification)' }, // Suggest verification intent
  visitation: { intent: 'visitation-root', suggestionText: 'tbd (visitation)' }, // Suggest visitation intent
}
