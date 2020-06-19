const { Suggestion, Payload } = require('dialogflow-fulfillment')

exports.handleEndConversation = async agent => {
  const helpMessage = 'Is there anything else I can help you with today?'

  await agent.add(helpMessage)
  await agent.add(new Suggestion('Submit Feedback'))

  await agent.context.set({
    name: 'waiting-feedback-root',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-restart-conversation',
    lifespan: 2,
  })
}

exports.tbd = async agent => {
  const tbdMessage = 'At this time, I am not able to answer specific questions about your case. If you are seeking information MDHS programs, please visit www.mdhs.ms.gov or contact us <a href="https://www.mdhs.ms.gov/contact/" target="_blank">here</a>'
  await agent.add(tbdMessage)
  await this.handleEndConversation(agent)
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
    supportType === 'report information about the parent who pays support'
  ) {
    descriptionText = 'What information do you want to share regarding the parent who pays child support? Helpful information includes this parent\'s address and phone number, employer information, asset information or information about this parent\'s ability to work.'
  } else if (supportType === 'request case closure') {
    descriptionText =
      'What information do you want to share regarding your request for case closure?'
  } else if (supportType === 'add authorized user') {
    descriptionText =
      'Please tell us the name and relationship of the person you are authorizing.'
  } else {
    descriptionText = 'Please describe your request.'
  }
  return descriptionText
}

// Format any number as currency, with prefixed $ sign, commas added per thousands & decimals fixed to 2
exports.formatCurrency = num => {
  return (
    '$' +
    parseFloat(num)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  )
}

// Handle startOfConversation
exports.startRootConversation = async agent => {
  try {
    await agent.add('What can I help you with?')
    await agent.add(new Suggestion('Common Requests'))
    await agent.add(new Suggestion('Appointments'))
    await agent.add(new Suggestion('Payments'))
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('Opening a Child Support Case'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.add(new Suggestion('Policy Manual'))
    await agent.add(new Suggestion('Stimulus Check'))
    await agent.add(new Suggestion('Cooperation'))
    await agent.add(new Suggestion('Visitation'))
    await agent.add(new Suggestion('Enforcement Action'))
  } catch (err) {
    console.error(err)
  }
}

// Send a payload to disable user input and require suggestion selection
exports.disableInput = async agent => {
  try {
    await agent.add(
      new Payload(
        agent.UNSPECIFIED,
        { disableInput: 'true' },
        {
          sendAsMessage: true,
          rawPayload: true,
        }
      )
    )
  } catch (err) {
    console.error(err)
  }
}

// Directs the user to Casey
exports.caseyHandoff = async agent => {
  try {
    await agent.add(
      'Click <a href="https://mdhs-policysearch.cambriasolutionssc.com" target="_blank">Here</a> to search the Child Support Policy Manual'
    )
    await this.handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

// Handles default unhandled intent when no categories are found
exports.defaultUnhandledResponse = async agent => {
  try {
    await agent.add(
      'I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.'
    )
  } catch (err) {
    console.error(err)
  }
}


exports.restartConversation = async agent => {
  try {
    await this.startRootConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.acknowledgePrivacyStatement = async agent => {
  try {
    // TODO!!!! NEED TO DELETE THIS!!!! Only a bandaid fix while we implement a proper solution
    await agent.context.set({
      name: 'cse-subject-matter',
      lifespan: 999,
    })

    await this.startRootConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.globalRestart = async agent => {
  try {
    await this.startRootConversation(agent)
  } catch (err) {
    console.error(err)
  }
}


exports.welcome = async agent => {
  try {
    await agent.add(
      'Hi, I\'m Gen. I am not a real person, but I can help you with common child support requests. Are you here to get help with Child Support?'
    )
    await this.disableInput(agent)
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-not-child-support',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-yes-child-support',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.fallback = async agent => {
  try {
    await agent.add(
      'I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.yesChildSupport = async agent => {
  try {
    await agent.add(
      'Great! I can assist you by providing general information about the child support program or by directing common child support requests to the appropriate MDHS team for handling. The information I provide is not legal advice. MDHS does not provide legal representation. Also, please do not enter SSN or DOB in at any time during your conversations.'
    )
    await agent.add(
      'By clicking "I Acknowledge" below you are acknowledging receipt and understanding of these statements and the MDHS Website Disclaimers, Terms, and Conditions found <a href="https://www.mdhs.ms.gov/privacy-disclaimer/" target="_blank">here</a>, and that you wish to continue.'
    )
    await agent.add(new Suggestion('I Acknowledge'))
    await this.disableInput(agent)
    await agent.context.set({
      name: 'waiting-acknowledge-privacy-statement',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}
