const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')
const { parsePhoneNumberFromString } = require('libphonenumber-js/min')

const {
  handleEndConversation,
  validateCaseNumber,
  toTitleCase,
  formatDescriptionText,
  disableInput,
} = require('../globalFunctions')

const {
  formatConfirmationResponse,
  handleCaseNumber,
  startSupportConvo,
  supportMoreOptions,
  checkForLumpSum,
  handleContactCollection,
  formatCardText,
  formatSummary,
} = require('./supportHelperFunctions.js')

const { sendToServiceDesk } = require('./postToServiceDesk.js')

exports.supportRoot = async agent => {
  await startSupportConvo(agent)
}

exports.supportParentReceiving = async agent => {
  try {
    await agent.add(
      'I can help parents receiving payments with the following requests. If you don\'t see what you need, select "More".'
    )
    await agent.add(new Suggestion('Request Contempt Action'))
    await agent.add(
      new Suggestion('Child Support Payment Increase or Decrease')
    )
    await agent.add(new Suggestion('Change of Personal Information'))
    await agent.add(new Suggestion('Request Case Closure'))
    await agent.add(new Suggestion('Emancipation'))
    await agent.add(new Suggestion('Cooperation'))
    await agent.add(new Suggestion('Safety'))
    await agent.add(new Suggestion('Good Cause'))
    await agent.add(new Suggestion('Verification'))
    await agent.add(new Suggestion('More'))

    await agent.context.set({
      name: 'waiting-support-parent-receiving-more',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentPaying = async agent => {
  try {
    await agent.add(
      'I can help parents making payments with the following requests. If you don\'t see what you need, select "More".'
    )
    await agent.add(new Suggestion('Change of Personal Information'))
    await agent.add(new Suggestion('Change of Employment Status'))
    await agent.add(
      new Suggestion('Child Support Payment Increase or Decrease')
    )
    await agent.add(new Suggestion('Visitation'))
    await agent.add(new Suggestion('Emancipation'))
    await agent.add(new Suggestion('More'))

    await agent.context.set({
      name: 'waiting-support-employment-status',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-parent-paying-more',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportEmployer = async agent => {
  try {
    await agent.add('Click below to get started with a Lump Sum Notification.')
    await agent.add(new Suggestion('Employer Report Lump Sum Notification'))
  } catch (err) {
    console.error(err)
  }
}

exports.supportGoodCause = async agent => {
  try {
    const link = '<a href="https://www.mdhs.ms.gov/wp-content/uploads/2019/08/MDHS_CSE_Parents-Handbook_V2.pdf" target="_blank">click here</a>'
    await agent.add(
      'If you were referred to child support by another program that requires cooperation with child support, you may be excused from cooperating with child support \
      if one of the following circumstances applies to your family: \
      <ul> \
        <li>The other parent has caused physical or emotional harm to the child.</li> \
        <li>The other parent has caused physical or emotional harm which affects your ability to care for the child(ren).</li> \
        <li>There is a protective order against the other parent. </li> \
        <li>The child(ren) were conceived of either rape or incest.</li> \
        <li>Legal proceedings for the adoption of the child are pending before a court of competent jurisdiction.</li> \
        <li>You are receiving assistance from a public or licensed private social service agency to help determine whether you should allow your child(ren) to be adopted.</li>\
      </ul>'
    )

    await agent.add(`If one of these exemptions applies to your family, please submit a request below and a representative will reach out to you \
      for more information, or you may call 1-877-882-4916. Please ${link} to learn what documentation is required for good cause exemptions.`)

    await agent.add(new Suggestion('Submit Support Request'))

    await handleEndConversation(agent)

    // TODO!!! Still need to properly implement the support request feature and create a new ticket type for good cause
    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-goodCause',
      lifespan: 1
    })

    await agent.context.set({
      name: 'waiting-support-parent-receiving-more',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingEmancipation = async agent => {
  try {
    await agent.add(
      'Unless otherwise ordered by the court, child support generally continues in Mississippi until the child emancipates when a child: 1) reaches the age of 21; 2) marries; 3) joins and serves in the military on a full time basis; or 4) is convicted of a felony and is sentenced to incarceration of at least 2 years. A court may emancipate a child for other reasons allowable under law. Emancipation does not terminate the obligation to satisfy child support arrears that exist at the time of emancipation.'
    )

    await agent.add(
      'Please <a href="https://www.acf.hhs.gov/css/irg-state-map" target="_blank">click here</a> for emancipation information from other states.'
    )

    await agent.add(new Suggestion('Submit Feedback'))
    await agent.add(new Suggestion('Request Case Closure'))

    await agent.context.set({
      name: 'waiting-feedback-root',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-support-parent-receiving-more',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingMore = async agent => {
  await supportMoreOptions(agent, 'receiving')
}

exports.supportParentPayingMore = async agent => {
  await supportMoreOptions(agent, 'paying')
}

exports.supportNoOptionsSelected = async agent => {
  try {
    await agent.add(
      'Would you like to submit an inquiry or go back to support options?'
    )
    await agent.add(new Suggestion('Inquiry'))
  } catch (err) {
    console.error(err)
  }
}

exports.supportEmploymentStatus = async agent => {
  try {
    await agent.add('Which of the following applies to you?')
    await agent.add(new Suggestion('Full Time to Part Time'))
    await agent.add(new Suggestion('Part Time to Full Time'))
    await agent.add(new Suggestion('Loss of Employer'))
    await agent.add(new Suggestion('Change or Add Employer'))
    await agent.context.set({
      name: 'waiting-support-handle-employment-status',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportHandleEmploymentStatus = async agent => {
  const formattedEmploymentStatus = toTitleCase(
    agent.parameters.employmentStatus
  )
  const supportType = 'Change of Employment Status'
  try {
    await agent.add(
      'Got it. I have a few questions to make sure your request gets to the right place. What\'s your **first name**?'
    )
    await agent.context.set({
      name: 'waiting-support-collect-first-name',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 100,
      parameters: {
        supportType: supportType,
        employmentChangeType: formattedEmploymentStatus,
      },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectNewEmployerName = async agent => {
  const newEmployerName = agent.parameters.newEmployerName
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    newEmployerName,
  }

  try {
    await agent.add('What is the new employer\'s phone number?')
    await agent.context.set({
      name: 'waiting-support-collect-new-employer-phone',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-new-employer-unknown-phone',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportNoNewEmployer = async agent => {
  const newEmployerName = 'Unknown new employer'
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    newEmployerName,
  }
  try {
    await agent.add('Please describe your request.')
    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 10,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectNewEmployerPhone = async agent => {
  const newEmployerPhone = agent.parameters.newEmployerPhone
  const formattedPhone = `+1${newEmployerPhone}`
  const isValid = validator.isMobilePhone(formattedPhone, 'en-US')
  if (isValid) {
    const phoneNumber = parsePhoneNumberFromString(
      formattedPhone
    ).formatNational()
    const ticketInfoParams = {
      ...agent.context.get('ticketinfo').parameters,
      phoneNumber,
    }
    try {
      await agent.add('Please describe your request.')
      await agent.context.set({
        name: 'ticketinfo',
        parameters: ticketInfoParams,
      })
      await agent.context.set({
        name: 'waiting-support-collect-issue',
        lifespan: 10,
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(
        'I\'m sorry, I didn\'t catch that as a valid phone number, what is your new employer\'s phone number.'
      )
      await agent.context.set({
        name: 'waiting-support-collect-new-employer-phone',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNewEmployerUnkownPhone = async agent => {
  const newEmployerPhone = 'Unknown phone number'
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    newEmployerPhone,
  }
  try {
    await agent.add('Please describe your request.')
    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 10,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

const formatRequest = (supportType) => {
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

  return formattedRequest
} 

/**
 * supportType is optional. If no value is passed in, agent.parameters.supportType.toLowerCase() will be used as the support type
 */
exports.supportType = async (agent, supportType) => {
  try {
    const _supportType = supportType ? supportType : (agent.parameters.supportType ? agent.parameters.supportType.toLowerCase() : 'inquiry')
    const formattedRequest = formatRequest(supportType)

    await agent.add(
      `Got it. I have a few questions to make sure your ${formattedRequest} gets to the right place. What's your **first name**?`
    )
    await agent.context.set({
      name: 'waiting-support-collect-first-name',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 100,
      parameters: { supportType: _supportType },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSubmitSupportRequestInquiry = async (agent) => {
  try {
    await this.supportType(agent, 'inquiry')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestCooperation = async (agent) => {
  try {
    await this.supportType(agent, 'cooperation')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestSafety = async (agent) => {
  try {
    await this.supportType(agent, 'safety')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestGoodCause = async (agent) => {
  try {
    await this.supportType(agent, 'good cause')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestVerification = async (agent) => {
  try {
    await this.supportType(agent, 'verification')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestRequestPaymentHistory = async (agent) => {
  try {
    await this.supportType(agent, 'request payment history')
  } catch (e) {
    console.error(e)
  }
}

exports.supportSubmitSupportRequestInterstate = async (agent) => {
  try {
    await this.supportType(agent, 'interstate')
  } catch (e) {
    console.error(e)
  }
}

exports.supportCollectFirstName = async agent => {
  const firstName = agent.parameters.firstName
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    firstName,
  }
  try {
    await agent.add(`Thanks ${firstName}, what is your **last name**?`)

    await agent.context.set({
      name: 'waiting-support-collect-last-name',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectLastName = async agent => {
  const lastName = agent.parameters.lastName
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    lastName,
  }
  try {
    await agent.add(
      'What is your **phone number** so we can reach out to you with a solution?'
    )
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
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportInquiries = async agent => {
  try {
    await this.supportType(agent, 'inquiry')
  } catch (err) {
    console.error(err)
  }
}

exports.supportReviewPayments = async agent => {
  try {
    await this.supportType(agent, 'child support increase or decrease')
  } catch (err) {
    console.error(err)
  }
}

exports.supportNoPhoneNumber = async agent => {
  const phoneNumber = 'No Phone Number'
  const firstName = agent.context.get('ticketinfo').parameters.firstName
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    phoneNumber,
  }

  try {
    await agent.add(
      `No problem, ${firstName}. What is your **email address** so that we can reach out to you with a solution?`
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
      parameters: ticketInfoParams,
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
    const phoneNumber = parsePhoneNumberFromString(
      formattedPhone
    ).formatNational()

    const ticketInfoParams = {
      ...agent.context.get('ticketinfo').parameters,
      phoneNumber,
    }

    try {
      await agent.add(
        `Thanks, ${firstName}. What is your **email address** so that we can reach out to you with a solution?`
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
        parameters: ticketInfoParams,
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(
        'I didn\'t recognize that as a phone number, **starting with area code**, what is your **phone number**?'
      )
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
  const isLumpSum = await checkForLumpSum(agent)
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    email,
  }

  if (isValid) {
    if (!isLumpSum) {
      try {
        await agent.add(
          'What is your **case number**? Please do not provide your social security number.'
        )

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
          parameters: ticketInfoParams,
        })
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        await agent.add('What is the **name of your company/employer**?')

        await agent.context.set({
          name: 'waiting-support-collect-company',
          lifespan: 3,
        })

        await agent.context.set({
          name: 'ticketinfo',
          parameters: ticketInfoParams,
        })
      } catch (err) {
        console.error(err)
      }
    }
  } else {
    try {
      await agent.add(
        'I didn\'t recognize that as an email address, could you say that again?'
      )
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
  // Check to see if they have provided a phone number
  const phoneNumber = agent.context.get('ticketinfo').parameters.phoneNumber
  const isLumpSum = await checkForLumpSum(agent)

  if (phoneNumber.toLowerCase() !== 'no phone number') {
    const email = 'No Email Provided'
    const ticketInfoParams = {
      ...agent.context.get('ticketinfo').parameters,
      email,
    }
    if (!isLumpSum) {
      try {
        await agent.add(
          'What is your **case number**? Please do not provide your social security number.'
        )

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
          parameters: ticketInfoParams,
        })
      } catch (err) {
        console.error(err)
      }
    } else {
      try {
        await agent.add('What is the **name of your company/employer**?')

        await agent.context.set({
          name: 'waiting-support-collect-company',
          lifespan: 3,
        })

        await agent.context.set({
          name: 'ticketinfo',
          parameters: ticketInfoParams,
        })
      } catch (err) {
        console.error(err)
      }
    }
  } else {
    try {
      await agent.add(
        'We need either a phone number or an email in order to continue, which would you like to provide?'
      )
      await agent.add(new Suggestion('Email'))
      await agent.add(new Suggestion('Phone Number'))

      await agent.context.set({
        name: 'waiting-support-retry-email',
        lifespan: 3,
      })

      await agent.context.set({
        name: 'waiting-support-retry-phone-number',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportRetryPhoneNumber = async agent => {
  try {
    await agent.add(
      '**Starting with area code**, what is your **phone number**?'
    )
    await agent.context.set({
      name: 'waiting-support-handle-phone-retry',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportHandlePhoneRetry = async agent => {
  const isLumpSum = await checkForLumpSum(agent)
  try {
    await handleContactCollection(agent, 'phone', isLumpSum)
  } catch (err) {
    console.error(err)
  }
}

exports.supportRetryEmail = async agent => {
  try {
    await agent.add('What is your **email address**?')
    await agent.context.set({
      name: 'waiting-support-handle-email-retry',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportHandleEmailRetry = async agent => {
  const isLumpSum = await checkForLumpSum(agent)
  try {
    await handleContactCollection(agent, 'email', isLumpSum)
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectCompanyName = async agent => {
  const companyName = toTitleCase(agent.parameters.companyName)
  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    companyName,
  }

  try {
    await agent.add(
      'What information do you want to share regarding the reporting of the Lump Sum Notification? You can use as many messages as you like – just click the "I\'m Done" button when you\'re finished.'
    )

    await agent.context.set({
      name: 'waiting-support-collect-issue',
      lifespan: 10,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCaseNumber = async agent => {
  const caseNumber = agent.parameters.caseNumber
  const noCaseNumber = agent.parameters.noCaseNumber
  const validCaseNumber = validateCaseNumber(caseNumber)
  // Retrieve what type of issue this is, and change the wording appropriately
  const supportType = await agent.context.get('ticketinfo').parameters
    .supportType
  const descriptionText = formatDescriptionText(supportType)

  if (noCaseNumber && noCaseNumber !== '') {
    await handleCaseNumber(descriptionText, agent, 'Unknown Case Number')
  } else if (caseNumber && !validCaseNumber) {
    try {
      await agent.add(
        'I didn\'t catch that as a valid case number, case numbers are nine digits, always start with a 6, and may end with a letter of the alphabet.'
      )
      await agent.add('What is your **case number**?')
      await agent.context.set({
        name: 'waiting-support-case-number',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-no-case-number',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await handleCaseNumber(descriptionText, agent, caseNumber)
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNoCaseNumber = async agent => {
  // Retrieve what type of issue this is, and change the wording appropriately
  const supportType = agent.context.get('ticketinfo').parameters.supportType
  const descriptionText = formatDescriptionText(supportType)
  try {
    await handleCaseNumber(descriptionText, agent, 'Unknown Case Number')
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectIssue = async agent => {
  const ticketInfo = await agent.context.get('ticketinfo').parameters
  const request = agent.parameters.request

  const supportSummary = formatSummary(ticketInfo)
  const cardText = formatCardText(ticketInfo, request)

  const ticketInfoParams = {
    ...agent.context.get('ticketinfo').parameters,
    supportSummary,
  }
  ticketInfoParams.requestSummary = request

  try {
    await agent.add(
      'Okay, I\'ve put your request together. Here\'s what I\'ve got. Click \'Go Back\' to edit your message or submit to send to a representative.'
    )
    await agent.add(
      new Card({
        title: `${supportSummary}`,
        text: `${cardText}`,
      })
    )
    await agent.add(new Suggestion('Submit'))
    await agent.add(new Suggestion('Cancel'))
    // Force user to select suggestion
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-support-submit-issue',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-cancel-issue',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'ticketinfo',
      parameters: ticketInfoParams,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSumbitIssue = async agent => {
  const ticketinfo = agent.context.get('ticketinfo').parameters
  const filteredRequests = ticketinfo.requestSummary
  const firstName = ticketinfo.firstName
  const lastName = ticketinfo.lastName
  const caseNumber = ticketinfo.caseNumber
  const phoneNumber = ticketinfo.phoneNumber
  const email = ticketinfo.email
  const company = ticketinfo.companyName
  const supportSummary = ticketinfo.supportSummary
  const newEmployerName = ticketinfo.newEmployerName
  const newEmployerNumber = ticketinfo.newEmployerPhone
  const employmentChangeType = ticketinfo.employmentChangeType

  // Prepare payload fields for service desk call
  const requestFieldValues = {
    supportSummary,
    filteredRequests,
    firstName,
    lastName,
    phoneNumber,
    email,
    caseNumber,
    company,
    newEmployerName,
    newEmployerNumber,
    employmentChangeType,
  }

  // Send ticket data to service desk api
  const postToServiceDesk = await sendToServiceDesk(requestFieldValues)
  const issueKey = postToServiceDesk.issueKey

  if (issueKey) {
    try {
      // Get appropriate confirmation reponse
      const confirmationRespone = await formatConfirmationResponse(agent)
      const cardText = formatCardText(ticketinfo, filteredRequests)
      await agent.add(
        new Card({
          title: `${supportSummary}: Issue #${issueKey}`,
          text: `${cardText}`,
        })
      )

      await agent.add(confirmationRespone)
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
    // Handle service desk errors?
    await agent.add(
      'Looks like something has gone wrong! Please try again or call please call <a href="tel:+18778824916">1-877-882-4916</a> to reach a support representative.'
    )
    await handleEndConversation(agent)
  }
}

exports.supportCancel = async agent => {
  try {
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentPayingEmploymentInfo = async agent => {
  try {
    await agent.add(
      'Would you like to change or edit information about your employment status?'
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-support-edit-provider-employment',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportEditProviderEmployment = async agent => {
  try {
    const yesNo = agent.parameters['yes-no']
    if (yesNo === 'yes') {
      await this.supportEmploymentStatus(agent)
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.error(err)
  }
}

exports.supportReportProviderEmployment = async agent => {
  try {
    const yesNo = agent.parameters['yes-no']
    if (yesNo === 'yes') {
      await this.supportType(agent, 'Report Information About the Parent who Pays Support')
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingEmploymentInfo = async agent => {
  try {
    await agent.add(
      'Would you like to report information about the parent who provides support?'
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-support-report-provider-employment',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentsGuideCSE = async agent => {
  try {
    await agent.add('The purpose of the child support program is to secure financial, medical and emotional support for children and families, thereby, contributing to a family’s ability to become self-sufficient and maintain self-sufficiency. The Mississippi Department of Human Services, Division of Child Support Enforcement exists to provide these services to the families of Mississippi.')

    await agent.add('Please <a href="https://www.mdhs.ms.gov/wp-content/uploads/2019/08/MDHS_CSE_Parents-Handbook_V2.pdf" target="_blank">click here</a> to open the Parent\'s Guide to CSE for more information')
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingCooperation = async agent => {
  try {
    const cooperationLink = '<a href="https://www.mdhs.ms.gov/wp-content/uploads/2019/08/MDHS_CSE_Parents-Handbook_V2.pdf" target="_blank">click here</a>'

    await agent.add(
      'Parents are generally required to cooperate with child support to be eligible to receive or continue receiving certain other benefits such as TANF, food stamps (SNAP), Medicaid, child-care, housing, and other types of benefits. The application fee for child support services does not apply to TANF, food stamps (SNAP) or Medicaid cases.'
    )

    await agent.add(
      'If cooperating with child support causes concern for your safety or the safety of your child(ren), please click an option below to learn how the child support program takes precautions to ensure your safety, or click on good cause to see if you may qualify to be exempt from cooperation requirements. You should report safety concerns to child support immediately at 1-877-882-4916 or by submitting a request through the options below.'
    )

    await agent.add(
      `To learn more about cooperation and the benefits of cooperation, ${cooperationLink} or ask me your questions.`
    )

    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Safety'))
    await agent.add(new Suggestion('Verification'))
    await agent.add(new Suggestion('Good Cause'))

    await handleEndConversation(agent)

    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-cooperation',
      lifespan: 1
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingCooperationQ1 = async agent => {
  try {
    await agent.add(
      'Parents are generally required to cooperate with child support to be eligible to receive or continuing receiving certain other \
      benefits such as TANF, food stamps (SNAP), Medicaid, child-care, housing, and other types of benefits. The application fee for \
      child support services does not apply to TANF, food stamps (SNAP) or Medicaid cases. Cooperation is defined as the joint action \
      of working toward a common goal. Parents and child support staff must work together to ensure children receive the financial support they deserve. '
    )
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingCooperationQ2 = async agent => {
  try {
    await agent.add(
      'The benefits of cooperation are: \
      <ul> \
        <li>The establishment of paternity gives your child a sense of belonging that knowing both parents brings such as social and psychological advantages and a sense of family heritage, and may provide access to information that can complete your child’s medical history.</li> \
        <li>Paternity establishment should allow your child to be able to take advantage of social security, veteran’s benefits, and/or other government benefits, as well as inheritance rights.</li> \
        <li>Child support payments help provide financial security for the child.</li> \
        <li>Medical support in the form of health insurance or cash medical support can help provide for the medical needs of the child. </li> \
      </ul>'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.supportParentReceivingCooperationQ3 = async agent => {
  try {
    const link = '<a href="https://www.mdhs.ms.gov/wp-content/uploads/2019/08/MDHS_CSE_Parents-Handbook_V2.pdf" target="_blank">click here</a>'
    await agent.add(
      `If you participate in some public assistance programs, such as TANF or SNAP (food stamps), you are generally required \
      to cooperate with the child support program unless you have an approved good cause claim. To learn more about \
      cooperation, good cause, and family violence protections, please ${link}.`
    )
  } catch (err) {
    console.error(err)
  }
}