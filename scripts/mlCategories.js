exports.categoriesWithIntents = {
  accountBalance: {
    intent: 'pmtMethods-eCheckDebit',
    suggestionText: 'Account balance',
  },
  addressingCheck: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'Address check',
  },
  appointments: { intent: 'appts-root', suggestionText: 'Appointments' },
  arrears: { intent: 'iwoQA-arrears-balance', suggestionText: 'Arrears' },
  callcenterNotAnswering: { intent: 'callcenterNotAnswering-root', suggestionText: 'Call not answered' }, // Suggest callcenter not answering
  cantMakePayments: {
    intent: 'pmts-general-make-payments',
    suggestionText: `Can't make payments`,
  },
  card: { intent: 'eppi-get-card', suggestionText: `EPPI card` },
  caseNumber: {
    intent: 'caseQA-general',
    suggestionText: 'Case specific questions',
  },
  caseStatus: {
    intent: 'caseQA-general',
    suggestionText: 'Case specific questions',
  },
  changeEmploymentInformation: {
    intent: 'support-root',
    suggestionText: 'Case specific questions',
  },
  changeOfInformation: {
    intent: 'caseQA-change-personal-info',
    suggestionText: 'Case specific questions',
  },
  childCare: { intent: 'childCare-root', suggestionText: 'Child Care' }, // Suggest child care intent
  complaints: { intent: 'complaints-root', suggestionText: 'Complaints' }, // Suggest complaints intent
  contactHuman: {
    intent: 'contact-qa-number',
    suggestionText: 'Contact',
  },
  documentation: { intent: 'documentation-root', suggestionText: 'Documents' }, // Suggest documentation intent
  email: { intent: 'email-root', suggestionText: 'Email' }, // Suggest email intent
  emancipation: {
    intent: 'emancipation-qa-age',
    suggestionText: 'Emancipation',
  },
  enforcement: { intent: 'enforcement-root', suggestionText: 'Enforcement' },
  estimatePayments: {
    intent: 'pmt-calc-root',
    suggestionText: 'Estimate payments',
  },
  fax: { intent: 'fax-root', suggestionText: 'Fax' }, // Suggest fax intent
  gratitude: { intent: 'gratitude-root', suggestionText: 'Gratitude' }, // Suggest gratitude intent
  greaterThanOneMonth: { intent: 'greaterThanOneMonth-root', suggestionText: 'tbd (greaterThanOneMonth)' }, // suggest > 1 month intent
  incarceration: {
    intent: 'support-qa-ncp-prison',
    suggestionText: 'Incarceration',
  },
  infoAboutParent: { intent: 'support-root', suggestionText: 'Support' }, // Perhaps move more specific
  insufficientResponse: { intent: 'insufficientResponse-root', suggestionText: 'tbd (insufficientResponse)' }, // Suggest insufficient response handler
  interstate: { intent: 'interstate-root', suggestionText: 'Interstate' }, // Suggest interstate intent
  legal: { intent: 'legal-root', suggestionText: 'Legal' }, // Suggest legal intent
  licenseSuspension: {
    intent: 'enforcement-license-suspension',
    suggestionText: 'License suspension',
  },
  login: { intent: 'login-root', suggestionText: 'Login Issue' }, // Suggest login intent
  makePayment: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'Make payments',
  },
  notReceivedPayment: {
    intent: 'pmtQA-havent-received',
    suggestionText: `Haven't received payments`,
  },
  officeLocations: { intent: 'map-root', suggestionText: 'Office locations' },
  onlineAction: { intent: 'onlineAction-root', suggestionText: 'Online Issue' }, // suggest online action intent
  openCase: { intent: 'open-csc-root', suggestionText: 'Open case' },
  paidButNotReceived: { intent: 'paidButNotReceived-root', suggestionText: 'Not received payment' }, // Suggest paid but not received intent
  paternity: {
    intent: 'geneticTesting-request',
    suggestionText: 'Genetic testing',
  },
  paymentHistory: { intent: 'support-root', suggestionText: 'Payment history' },
  paymentModification: {
    intent: 'caseQA-increase-review',
    suggestionText: 'Payment modification',
  },
  paymentTimelines: { intent: 'paymentTimelines-root', suggestionText: 'Payment Timelines' }, // Need payment timelines intent
  refund: { intent: 'refund-root', suggestionText: 'Refund' }, // Suggest refund intent
  snap: { intent: 'snap-root', suggestionText: 'SNAP' }, // Suggest snap intent
  supportInquiries: {
    intent: 'support-root',
    suggestionText: 'Support inquiries',
  },
  tanf: { intent: 'tanf-root', suggestionText: 'TANF' }, // Suggest tanf intent
  terminate: { intent: 'support-root', suggestionText: 'Close case' },
  verification: { intent: 'verification-root', suggestionText: 'Verification' }, // Suggest verification intent
  visitation: { intent: 'visitation-root', suggestionText: 'Visitation' }, // Suggest visitation intent
}
