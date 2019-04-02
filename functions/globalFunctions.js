exports.handleEndConversation = async agent => {
  await agent.add(`Can I help you with anything else?`)
  await agent.context.set({
    name: 'waiting-end-conversation',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-restart-conversation',
    lifespan: 2,
  })
}

// Used to calculate the percentage of income for employers to withhold
exports.calculatePercentage = (isSupporting, inArrears) => {
  if (isSupporting && inArrears) {
    return 55
  } else if (isSupporting && !inArrears) {
    return 50
  } else if (!isSupporting && !inArrears) {
    return 60
  } else if (!isSupporting && inArrears) {
    return 65
  } else {
    throw new Error('Cannot calculate percentage.')
  }
}

// Used to validate that the user has provided a valid case number
// Valid case numbers start with a 6, are nine digits long, and may have
// a letter of the alphabet at the end.
exports.validateCaseNumber = caseNumber => {
  let validCaseNumber = true
  if (caseNumber.charAt(0) !== '6') {
    validCaseNumber = false
  }
  if (caseNumber.length !== 9 && caseNumber.length !== 10) {
    validCaseNumber = false
  }
  if (
    caseNumber.length === 10 &&
    caseNumber.charAt(9).match(/[a-z]/g === null)
  ) {
    validCaseNumber = false
  }
  if (caseNumber.length === 10) {
    const numberWithoutAlpha = caseNumber.slice(0, 9)

    if (isNaN(numberWithoutAlpha)) {
      validCaseNumber = false
    }
  }
  if (caseNumber.length === 9 && isNaN(caseNumber)) {
    validCaseNumber = false
  }
  return validCaseNumber
}

// Upper case the first letter of a string
exports.toTitleCase = string => {
  const excludedWords = ['or', 'and', 'on', 'of', 'to', 'the']
  return string.replace(/\w\S*/g, text => {
    if (!excludedWords.includes(text)) {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
    } else {
      return text
    }
  })
}

// Format description text for Support Requests
exports.formatDescriptionText = supportType => {
  let descriptionText
  if (supportType === 'request contempt action') {
    descriptionText =
      'Please describe your request for assistance regarding your Request for Contempt Action.'
  } else if (supportType === 'child support increase or decrease') {
    descriptionText =
      'Please describe your request for review of your child support payments.'
  } else if (supportType === 'change personal information') {
    descriptionText =
      'Please share with me the changes to your personal information. I can record changes that apply for the parent who pays or receives child support.'
  } else if (supportType === 'request payment history or record') {
    descriptionText =
      'What do you need exactly regarding payment history or payment records?'
  } else if (
    supportType === 'information about the parent who pays child support'
  ) {
    descriptionText =
      'What informaton do you want to share regarding the parent who pays child support?'
  } else if (supportType === 'request case closure') {
    descriptionText =
      'What informaton do you want to share regarding your request for case closure?'
  } else if (supportType === 'add authorized user') {
    descriptionText =
      'Please tell us the name and relationship of the person you are authorizing.'
  } else {
    descriptionText = 'Please describe your request.'
  }
  return descriptionText
}
