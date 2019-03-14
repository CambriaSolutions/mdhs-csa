const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')
const isNumber = require('lodash/isNumber')
const { handleEndConversation } = require('./globalFunctions.js')
const { sendToServiceDesk } = require('./postToServiceDesk.js')

exports.supportRoot = async agent => {
  try {
    await agent.add(
      `Please select what type of request you would like to create a ticket for.`
    )
    await agent.add(new Suggestion(`Request Contempt Action`))
    await agent.add(
      new Suggestion(`Child Support Payment Increase or Decrease`)
    )
    await agent.add(new Suggestion(`Change of Personal Information`))
    await agent.add(new Suggestion(`Change of Employment Status`))
    await agent.add(new Suggestion(`Request Payment History`))
    await agent.add(
      new Suggestion(`Information about parent who pays child support`)
    )
    await agent.add(new Suggestion(`Request Case Closure`))
    await agent.add(new Suggestion(`Employer Report Lump Sum Notification`))
    await agent.add(new Suggestion(`Add Authorized User`))

    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportType = async agent => {
  const supportType = agent.parameters.supportType.toLowerCase()

  let formattedRequest
  if (supportType === 'request contempt action') {
    formattedRequest = 'request for a contempt action'
  } else if (supportType === 'child support payment increase or decrease') {
    formattedRequest = 'request to review your child support payments'
  } else if (supportType === 'employer report lump sum notification') {
    formattedRequest = 'lump sum notification'
  } else if (supportType === 'add authorized user') {
    formattedRequest = 'request to add an authorized user'
  } else {
    formattedRequest = 'request'
  }
  await agent.add(
    `Got it. I have a few questions to make sure your ${formattedRequest} gets
    to the right place. What's your first and last name?`
  )
  await agent.add(new Suggestion(`Chris Freeman`))

  await agent.context.set({
    name: 'waiting-support-collect-name',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'ticketinfo',
    lifespan: 100,
    parameters: { supportType: supportType },
  })
}

exports.supportCollectName = async agent => {
  const firstName = agent.parameters.firstName
  const lastName = agent.parameters.lastName

  // TODO: save data to db
  if (firstName && lastName) {
    try {
      await agent.add(
        `Thanks ${firstName}. What is your phone number
          so we can reach out to you with a solution?`
      )
      await agent.add(new Suggestion(`9167990766`))
      await agent.context.set({
        name: 'waiting-support-phone-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { firstName: firstName, lastName: lastName },
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(
        `Sorry, I didn't catch that. What's your first and last name?`
      )
      await agent.context.set({
        name: 'waiting-support-name',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportPhoneNumber = async agent => {
  const phoneNumber = agent.parameters.phoneNumber
  const formattedPhone = `+1${phoneNumber}`
  const isValid = validator.isMobilePhone(formattedPhone, 'en-US')

  // TODO: save data to db
  if (isValid) {
    try {
      await agent.add(`What is your email address?`)
      await agent.add(new Suggestion(`cfreeman@cambriasolutions.com`))

      await agent.context.set({
        name: 'waiting-support-email',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { phoneNumber: phoneNumber },
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(`
      I didn't recognize that as a phone number, 
      starting with area code, what is your phone number?
      `)
      await agent.context.set({
        name: 'waiting-support-phone-number',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportEmail = async agent => {
  const email = agent.parameters.email
  const isValid = validator.isEmail(email)

  if (isValid) {
    try {
      await agent.add(`Thanks, what is your case number?`)
      await agent.add(new Suggestion(`623456789`))

      await agent.context.set({
        name: 'waiting-support-case-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'waiting-support-no-case-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { email: email },
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(`
      I didn't recognize that as an email address, 
      could you say that again?
      `)
      await agent.context.set({
        name: 'waiting-support-email',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportCaseNumber = async agent => {
  const rawResponse = agent.parameters.caseNumber
  const parsedResponse = rawResponse.split(' ')
  let caseNumber

  parsedResponse.forEach(phrase => {
    if (phrase.charAt(0) === '6') {
      // If the phrase is a nine digit number,
      // which starts with a six, may include hyphens,
      // and may have a letter, then the case number is valid
      if (phrase.replace(/\D/g, '').length === 9) {
        caseNumber = phrase
      }
    }
  })

  // let validCaseNumber
  // parsedResponse.forEach(word => {
  //   if (word.charAt(0) === '6'){
  //     validCaseNumber = true
  //   }
  //   if(word.length === 9){
  //     validCaseNumber = true
  //   }
  //   if(word.endsWith()){

  //   }
  // })

  // Retrieve what type of issue this is, and change the wording appropriately
  const supportType = agent.context.get('ticketinfo').parameters.supportType
  let descriptionText
  if (supportType === 'request contempt action') {
    descriptionText =
      'Please describe your request for assistance regarding your Request for Contempt Action.'
  } else if (
    supportType ===
    'Please describe your request for review of your child support payments.'
  ) {
    descriptionText =
      'Please describe your request for review of your child support payments.'
  } else {
    descriptionText = 'Please describe your issue or request.'
  }

  if (!caseNumber || caseNumber === 0) {
    await agent.add(
      `I didn't catch that as a valid case number, case numbers always start with a 6, and may end with a letter of the alphabet.`
    )
    await agent.add(`What is your case number?`)
    await agent.context.set({
      name: 'waiting-support-case-number',
      lifespan: 3,
    })
  } else {
    try {
      await agent.add(
        `${descriptionText} You can use as many messages as
          you like - just click the "I'm Done" button when you are finished.`
      )
      await agent.add(new Suggestion(`My issue`))

      await agent.context.set({
        name: 'waiting-support-collect-issue',
        lifespan: 10,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { caseNumber: caseNumber },
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNoCaseNumber = async agent => {
  const caseNumber = 'Unknown case number'
  const ticketinfo = agent.context.get('ticketinfo').parameters
  if (ticketinfo)
    // TODO: save data to db
    try {
      await agent.add(
        `Please describe your issue or request. You can use as many messages as
          you like - just click the "I'm Done" button when you are finished.`
      )
      await agent.context.set({
        name: 'waiting-support-collect-issue',
        lifespan: 10,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { caseNumber: caseNumber },
      })
    } catch (err) {
      console.error(err)
    }
}

exports.supportCollectIssue = async agent => {
  const request = agent.parameters.request
  const requestsInContext = agent.context.get('requests')
  let requestCollection = []
  if (requestsInContext) {
    const storedRequests = requestsInContext.parameters.requests
    requestCollection = [...storedRequests, request]
  } else {
    requestCollection.push(request)
  }

  try {
    await agent.add(
      `Feel free to add to your issue, or click or say "I'm done"`
    )
    await agent.add(new Suggestion(`I'm done`))
    await agent.context.set({
      name: 'requests',
      lifespan: 5,
      parameters: { requests: requestCollection },
    })
    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-summarize-issue',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSummarizeIssue = async agent => {
  const rawRequests = agent.context.get('requests').parameters.requests
  const filteredRequests = rawRequests.join(' ')
  const ticketinfo = agent.context.get('ticketinfo').parameters
  const firstName = ticketinfo.firstName
  const lastName = ticketinfo.lastName
  const caseNumber = ticketinfo.caseNumber
  const phoneNumber = ticketinfo.phoneNumber
  const email = ticketinfo.email
  const supportType = ticketinfo.supportType
  let employmentSubType = ticketinfo.employmentSubType

  let cardTitle
  if (supportType === 'child support payment increase or decrease') {
    cardTitle = 'Order Review & Modification'
  } else if (supportType === 'change of employment status') {
    if (employmentSubType) {
      cardTitle = `Change of Employment Status - ${employmentSubType}`
    } else {
      cardTitle = `Change of Employment Status`
    }
  } else {
    cardTitle = supportType
  }

  if (filteredRequests && firstName && lastName && caseNumber && phoneNumber) {
    try {
      await agent.add(
        `Okay, I've put your request together. Here's what I've got.`
      )
      await agent.add(
        new Card({
          title: `${cardTitle}`,
          text: `Full Name: ${firstName} ${lastName}
          Phone Number: ${phoneNumber}
          Email: ${email}
          Case Number: ${caseNumber}
          Message: ${filteredRequests}`,
        })
      )
      await agent.add(new Suggestion(`Revise`))
      await agent.add(new Suggestion(`Submit`))
      await agent.context.set({
        name: 'waiting-support-submit-issue',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'waiting-support-revise-issue',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportReviseIssue = async agent => {
  try {
    await agent.add(
      `Let's start over. Please describe your issue. You can use as many messages as
        you like - just click the "I'm Done" button when you are finished.`
    )
    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 5,
    })
    await agent.context.set({
      name: 'requests',
      lifespan: 5,
      parameters: { requests: [] },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSumbitIssue = async agent => {
  const rawRequests = agent.context.get('requests').parameters.requests
  const filteredRequests = rawRequests.join(' ')
  const ticketinfo = agent.context.get('ticketinfo').parameters
  const firstName = ticketinfo.firstName
  const lastName = ticketinfo.lastName
  const caseNumber = ticketinfo.caseNumber
  const phoneNumber = ticketinfo.phoneNumber
  const email = ticketinfo.email
  const supportType = ticketinfo.supportType

  const requestFieldValues = {
    supportType,
    filteredRequests,
    firstName,
    lastName,
    phoneNumber,
    email,
    caseNumber,
  }

  const postToServiceDesk = await sendToServiceDesk(requestFieldValues)
  const ticketId = postToServiceDesk.issueId

  //TODO: send ticket data to service desk api
  try {
    await agent.add(`Thanks, your request has been submitted!`)
    await agent.add(
      new Card({
        title: `${supportType}: Ticket #${ticketId}`,
        text: `Full Name: ${firstName} ${lastName}
        Phone Number: ${phoneNumber}
        Email: ${email}
        Case Number: ${caseNumber}
        Message: ${filteredRequests}`,
      })
    )
    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
