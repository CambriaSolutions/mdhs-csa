const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')
const {
  handleEndConversation,
  validateCaseNumber,
  toTitleCase,
  formatDescriptionText,
} = require('./globalFunctions.js')
const { sendToServiceDesk } = require('./postToServiceDesk.js')

exports.supportRoot = async agent => {
  try {
    await agent.add(
      `I can help you create a formal request to our support representatives. Which general area would you like to continue with?`
    )
    await agent.add(new Suggestion(`Payments`))
    await agent.add(new Suggestion(`Request`))
    await agent.add(new Suggestion(`Change`))
    await agent.add(new Suggestion(`General Support`))
    await agent.context.set({
      name: 'waiting-support-payments',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-requests',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-change',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-general',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportPaymentsRoot = async agent => {
  try {
    await agent.add(
      `Regarding payments, I can help with the following options. Select which you would like to continue with.`
    )
    await agent.add(new Suggestion(`Child Support Increase or Decrease`))
    await agent.add(new Suggestion(`Request Payment History`))
    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportRequestsRoot = async agent => {
  try {
    await agent.add(
      `Please select what type of request you would like to create a ticket for.`
    )
    await agent.add(new Suggestion(`Request Contempt Action`))
    await agent.add(new Suggestion(`Request Case Closure`))
    await agent.add(new Suggestion(`Add Authorized User`))
    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportChangeRoot = async agent => {
  try {
    await agent.add(
      `Please select what type of change you would like to request.`
    )
    await agent.add(new Suggestion(`Change of Personal Information`))
    await agent.add(new Suggestion(`Change of Employment Status`))
    await agent.add(
      new Suggestion(`Information about the parent who pays child support`)
    )
    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-employment-status',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportGeneralRoot = async agent => {
  try {
    await agent.add(`What can I help you with?`)
    await agent.add(new Suggestion(`Employer Report LumpSum Notification`))
    await agent.add(new Suggestion(`Inquiries`))
    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportEmploymentStatus = async agent => {
  try {
    await agent.add(`Which of the following applies to you?`)
    await agent.add(new Suggestion(`Change of Employment Information`))
    await agent.add(new Suggestion(`Full Time to Part Time`))
    await agent.add(new Suggestion(`Part Time to Full Time`))
    await agent.add(new Suggestion(`Add Employer`))
    await agent.add(new Suggestion(`Loss of Employer`))
    await agent.add(new Suggestion(`Change of Employer`))
    await agent.context.set({
      name: 'waiting-support-handle-employment-status',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportHandleEmploymentStatus = async agent => {
  const employmentStatus = toTitleCase(agent.parameters.employmentStatus)
  const supportType = `Change of Employment Status`
  try {
    await agent.add(`Got it. I have a few questions to make sure your request gets
    to the right place. What's your first and last name?`)
    await agent.add(new Suggestion(`Chris Freeman`))

    await agent.context.set({
      name: 'waiting-support-collect-name',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 100,
      parameters: {
        supportType: supportType,
        employmentSubType: employmentStatus,
      },
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
  } else if (supportType === 'child support increase or decrease') {
    formattedRequest = 'request to review your child support payments'
  } else if (supportType === 'employer report lump sum notification') {
    formattedRequest = 'reporting of a Lump Sum Notification'
  } else if (supportType === 'add authorized user') {
    formattedRequest = 'request to add an authorized user to your account'
  } else {
    formattedRequest = 'request'
  }
  try {
    await agent.add(
      `Got it. I have a few questions to make sure your ${formattedRequest} gets
      to the right place. What's your first and last name?`
    )
    await agent.add(new Suggestion(`Chris Freeman`))

    await agent.context.set({
      name: 'waiting-support-collect-name',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 100,
      parameters: { supportType: supportType },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectName = async agent => {
  const firstName = toTitleCase(agent.parameters.firstName)
  const lastName = toTitleCase(agent.parameters.lastName)

  if (firstName && lastName) {
    try {
      await agent.add(
        `Thanks, ${firstName}. What is your phone number
          so we can reach out to you with a solution?`
      )
      await agent.add(new Suggestion(`9167990766`))
      await agent.context.set({
        name: 'waiting-support-phone-number',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-no-phone-number',
        lifespan: 3,
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
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNoPhoneNumber = async agent => {
  const phoneNumber = 'No Phone Number'
  const firstName = agent.context.get('ticketinfo').parameters.firstName

  try {
    await agent.add(
      `No problem, ${firstName}. What is your email address so that we can reach out to you with a solution?`
    )

    await agent.context.set({
      name: 'waiting-support-email',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-no-email',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: { phoneNumber: phoneNumber },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportPhoneNumber = async agent => {
  const phoneNumberResponse = agent.parameters.phoneNumber
  const formattedPhone = `+1${phoneNumberResponse}`
  const firstName = agent.context.get('ticketinfo').parameters.firstName
  const isValid = validator.isMobilePhone(formattedPhone, 'en-US')

  if (isValid) {
    const phoneNumber = parseInt(phoneNumberResponse)
    try {
      await agent.add(
        `Thanks, ${firstName}. What is your email address so that we can reach out to you with a solution?`
      )
      await agent.add(new Suggestion(`cfreeman@cambriasolutions.com`))

      await agent.context.set({
        name: 'waiting-support-email',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-no-email',
        lifespan: 3,
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
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportEmail = async agent => {
  const email = agent.parameters.email
  const isValid = validator.isEmail(email)
  const supportType = agent.context.get('ticketinfo').parameters.supportType
  const isLumpSum = supportType.includes('lump')

  if (isValid) {
    if (isLumpSum) {
      try {
        await agent.add(`What is the name of your company/employer?`)
        await agent.add(new Suggestion(`Company`))

        await agent.context.set({
          name: 'waiting-support-collect-company',
          lifespan: 3,
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
        await agent.add(`What is your case number?`)
        await agent.add(new Suggestion(`623456789`))

        await agent.context.set({
          name: 'waiting-support-case-number',
          lifespan: 3,
        })
        await agent.context.set({
          name: 'waiting-support-no-case-number',
          lifespan: 3,
        })
        await agent.context.set({
          name: 'ticketinfo',
          parameters: { email: email },
        })
      } catch (err) {
        console.error(err)
      }
    }
  } else {
    try {
      await agent.add(`
      I didn't recognize that as an email address, 
      could you say that again?
      `)
      await agent.context.set({
        name: 'waiting-support-email',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-no-email',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNoEmail = async agent => {
  const email = 'No Email Provided'

  try {
    await agent.add(`What is your case number?`)
    await agent.add(new Suggestion(`623456789`))
    await agent.context.set({
      name: 'waiting-support-case-number',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-no-case-number',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: { email: email },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportNoCaseNumber = async agent => {
  const email = 'No Email'
  const supportType = agent.context.get('ticketinfo').parameters.supportType
  const isLumpSum = supportType.includes('lump')

  if (isLumpSum) {
    try {
      await agent.add(`What is the name of your company/employer?`)
      await agent.add(new Suggestion(`Company`))

      await agent.context.set({
        name: 'waiting-support-collect-company',
        lifespan: 3,
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
      await agent.add(`What is your case number?`)
      await agent.context.set({
        name: 'waiting-support-email',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { email: email },
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportCollectCompanyName = async agent => {
  const companyName = toTitleCase(agent.parameters.companyName)

  try {
    await agent.add(
      `What information do you want to share regarding the reporting of the Lump Sum Notification? You can use as many messages as you like – just click the "I'm Done" button when you're finished.`
    )
    await agent.add(new Suggestion(`My issue`))

    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 10,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: { companyName: companyName },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCaseNumber = async agent => {
  const caseNumber = agent.parameters.caseNumber
  const validCaseNumber = validateCaseNumber(caseNumber)

  // Retrieve what type of issue this is, and change the wording appropriately
  const supportType = agent.context.get('ticketinfo').parameters.supportType
  const descriptionText = formatDescriptionText(supportType)

  if (!validCaseNumber) {
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
  const supportType = ticketinfo.supportType.toLowerCase()
  const companyName = ticketinfo.companyName
  const employmentSubType = ticketinfo.employmentSubType

  let supportSummary
  if (supportType === 'child support increase or decrease') {
    supportSummary = 'Order Review & Modification'
  } else if (supportType === 'change of employment status') {
    if (employmentSubType) {
      supportSummary = `Change of Employment Status - ${employmentSubType}`
    } else {
      supportSummary = `Change of Employment Status`
    }
  } else if (supportType === 'inquiry') {
    supportSummary = `Support Request`
  } else {
    supportSummary = toTitleCase(supportType)
  }

  if (filteredRequests && firstName && lastName && caseNumber && phoneNumber) {
    try {
      await agent.add(
        `Okay, I've put your request together. Here's what I've got.`
      )
      await agent.add(
        new Card({
          title: `${supportSummary}`,
          text: `Full Name: ${firstName} ${lastName}
          Phone Number: ${phoneNumber}
          Email: ${email}
          ${
            companyName
              ? `Company: ${companyName}`
              : `Case Number: ${caseNumber} `
          }
          Message: ${filteredRequests}`,
        })
      )
      await agent.add(new Suggestion(`Revise`))
      await agent.add(new Suggestion(`Submit`))
      await agent.context.set({
        name: 'waiting-support-submit-issue',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-revise-issue',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { supportSummary: supportSummary },
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
  const companyName = ticketinfo.companyName
  const supportSummary = ticketinfo.supportSummary

  // Prepare payload fields for service desk call
  const requestFieldValues = {
    supportSummary,
    filteredRequests,
    firstName,
    lastName,
    phoneNumber,
    email,
    caseNumber,
  }

  // Send ticket data to service desk api
  const postToServiceDesk = await sendToServiceDesk(requestFieldValues)
  const issueKey = postToServiceDesk.issueKey
  if (issueKey) {
    try {
      await agent.add(
        `Thanks, your request has been submitted! A member of our team will reach out within 1-2 business days to validate your request.`
      )
      await agent.add(
        new Card({
          title: `${supportSummary}: Issue #${issueKey}`,
          text: `Full Name: ${firstName} ${lastName}
          Phone Number: ${phoneNumber}
          Email: ${email}
          ${
            companyName
              ? `Company: ${companyName}`
              : `Case Number: ${caseNumber} `
          }
          Message: ${filteredRequests}`,
        })
      )

      // Clear out context for ticket info
      await agent.context.set({
        name: 'requests',
        lifespan: 0,
      })
      await agent.context.set({
        name: 'ticketinfo',
        lifespan: 0,
      })

      // Ask the user if they need anything else, set appropriate contexts
      await handleEndConversation(agent)
    } catch (err) {
      console.error(err)
    }
  } else {
    // handle service desk errors?
    await agent.add(`Looks like something has gone wrong!`)
    await handleEndConversation(agent)
  }
}
