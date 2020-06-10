exports.categoriesWithIntents = {
  accountBalance: {
    intent: 'pmtMethods-eCheckDebit',
    suggestionText: 'Account balance',
  },
  accountInformation: {
    intent: 'accountInformation-root',
    suggestionText: 'Account information'
  },
  addressingCheck: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'Address check',
  },
  appointments: {
    intent: 'appts-root',
    suggestionText: 'Appointments'
  },
  arrears: {
    intent: 'iwoQA-arrears-balance',
    suggestionText: 'Arrears'
  },
  card: {
    intent: 'eppi-get-card',
    suggestionText: 'EPPI card'
  },
  caseNumber: {
    intent: 'caseQA-general',
    suggestionText: 'Case Number',
  },
  caseStatus: {
    intent: 'caseQA-general',
    suggestionText: 'Case Status',
  },
  changeOfInformation: {
    intent: 'caseQA-change-personal-info',
    suggestionText: 'Change of Information',
  },
  childCare: {
    intent: 'childCare-root',
    suggestionText: 'Child care'
  }, // Suggest child care intent
  complaints: {
    intent: 'feedback-root',
    suggestionText: 'Complaints'
  }, // Suggest complaints intent
  contactHuman: {
    intent: 'contact-qa-number',
    suggestionText: 'Contact',
  },
  documentation: {
    intent: 'documentation-root',
    suggestionText: 'Documents'
  }, // Suggest documentation intent
  email: {
    intent: 'email-root',
    suggestionText: 'Email'
  }, // Suggest email intent
  emancipation: {
    intent: 'emancipation-qa-age',
    suggestionText: 'Emancipation',
  },
  employer: {
    intent: 'employer-root',
    suggestionText: 'Employer'
  },
  enforcement: {
    intent: 'enforcement-root',
    suggestionText: 'Enforcement'
  },
  estimatePayments: {
    intent: 'pmt-calc-root',
    suggestionText: 'Estimate payments',
  },
  fax: {
    intent: 'fax-root',
    suggestionText: 'Fax'
  }, // Suggest fax intent
  fee: {
    intent: 'fee-root',
    suggestionText: 'Fees'
  },
  gratitude: {
    intent: 'gratitude-root',
    suggestionText: 'Gratitude'
  }, // Suggest gratitude intent
  incarceration: {
    intent: 'support-qa-ncp-prison',
    suggestionText: 'Incarceration',
  },
  interstate: {
    intent: 'interstate-root',
    suggestionText: 'Interstate'
  }, // Suggest interstate intent
  legal: {
    intent: 'legal-root',
    suggestionText: 'Legal'
  }, // Suggest legal intent
  login: {
    intent: 'login-root',
    suggestionText: 'Login issue'
  }, // Suggest login intent
  makePayment: {
    intent: 'pmts-general-make-payments',
    suggestionText: 'Make payments',
  },
  notReceivedPayment: {
    intent: 'pmtQA-havent-received',
    suggestionText: 'Haven\'t received payments',
  },
  officeLocations: {
    intent: 'map-root',
    suggestionText: 'Office locations'
  },
  onlineAction: {
    intent: 'onlineAction-root',
    suggestionText: 'Online issue'
  }, // suggest online action intent
  openCase: {
    intent: 'open-csc-root',
    suggestionText: 'Open case'
  },
  other: {
    intent: 'other-root',
    suggestionText: 'Other'
  },
  paternity: {
    intent: 'geneticTesting-request',
    suggestionText: 'Genetic testing',
  },
  parentCseGuide: {
    intent: 'support-parentsGuideCSE',
    suggestionText: 'Parent’s Guide to CSE'
  },
  paymentTimelines: {
    intent: 'paymentTimelines-root',
    suggestionText: 'Payment timelines'
  }, // Need payment timelines intent
  phoneNumber: {
    intent: 'phoneNumber-root',
    suggestionText: 'Phone number'
  },
  refund: {
    intent: 'refund-root',
    suggestionText: 'Refund'
  }, // Suggest refund intent
  snap: {
    intent: 'snap-root',
    suggestionText: 'SNAP'
  }, // Suggest snap intent
  supportRequest: {
    intent: 'support-root',
    suggestionText: 'Support requests',
  },
  tanf: {
    intent: 'tanf-root',
    suggestionText: 'TANF'
  }, // Suggest tanf intent
  taxes: {
    intent: 'taxes-root',
    suggestionText: 'Taxes'
  },
  terminate: {
    intent: 'terminate-root',
    suggestionText: 'Close case'
  },
  verification: {
    intent: 'verification-root',
    suggestionText: 'Verification'
  }, // Suggest verification intent
  visitation: {
    intent: 'visitation-root',
    suggestionText: 'Visitation'
  }, // Suggest visitation intent
}
