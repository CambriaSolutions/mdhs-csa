const camelCase = require('camelcase')

exports.mapCategoryToIntent = category => {
  const formattedCategory = camelCase(category)
  // TBD: Query the db for these suggestions
  const suggestionsForCategories = {
    accountBalance: 'account balance',
    addressingCheck: 'make payments',
    appointments: 'appointments',
    arrears: 'arrears placeholder',
    callcenterNotAnswering: 'tbd',
    cantMakePayments: 'tbd',
    card: 'card',
    caseNumber: 'tbd',
    caseStatus: 'tbd',
    changeEmploymentInformation: 'tbd',
    changeOfInformation: 'tbd',
    childCare: 'tbd',
    complaints: 'tbd',
    contactHuman: 'tbd',
    documentation: 'tbd',
    email: 'tbd',
    emancipation: 'emancipation',
    enforcement: 'enforcement',
    estimatePayments: 'estimate payments',
    fax: 'tbd',
    gratitude: 'tbd',
    greaterThanOneMonth: 'tbd',
    incarceration: 'tbd',
    infoAboutParent: 'tbd',
    insufficientResponse: 'tbd',
    interstate: 'tbd',
    legal: 'tbd',
    licenseSuspension: 'license suspension',
    login: 'tbd',
    makePayment: 'make payment',
    notReceivedPayment: 'not received payment',
    officeLocations: 'office locations',
    onlineAction: 'tbd',
    openCase: 'open a case',
    paidButNotReceived: 'paid but not received',
    paternity: 'paternity',
    paymentHistory: 'tbd',
    paymentModification: 'payment modification',
    paymentTimelines: 'tbd', // possibly pmtQA-NCP-payment-status
    refund: 'tbd',
    snap: 'tbd',
    supportInquiries: 'support inquiry',
    tanf: 'tbd',
    terminate: 'close case',
    verification: 'tbd',
    visitation: 'tbd',
  }

  const suggestionText = suggestionsForCategories[formattedCategory]
  return suggestionText
}
