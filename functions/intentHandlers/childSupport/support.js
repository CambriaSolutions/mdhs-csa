const Logger = require('../../utils/Logger')
const logger = new Logger('Support')

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

exports.supportParentReceivingMore = async agent => {
  await supportMoreOptions(agent, 'receiving')
}

exports.supportParentPayingMore = async agent => {
  await supportMoreOptions(agent, 'paying')
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
      logger.error(err.message, err)
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
      logger.error(err.message, err)
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestInquiry = async (agent) => {
  try {
    await this.supportType(agent, 'inquiry')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestCooperation = async (agent) => {
  try {
    await this.supportType(agent, 'cooperation')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestSafety = async (agent) => {
  try {
    await this.supportType(agent, 'safety')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestGoodCause = async (agent) => {
  try {
    await this.supportType(agent, 'good cause')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestVerification = async (agent) => {
  try {
    await this.supportType(agent, 'verification')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestRequestPaymentHistory = async (agent) => {
  try {
    await this.supportType(agent, 'request payment history')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportSubmitSupportRequestInterstate = async (agent) => {
  try {
    await this.supportType(agent, 'interstate')
  } catch (err) {
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
  }
}

exports.supportInquiries = async agent => {
  try {
    await this.supportType(agent, 'inquiry')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportReviewPayments = async agent => {
  try {
    await this.supportType(agent, 'child support increase or decrease')
  } catch (err) {
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
      logger.error(err.message, err)
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
      logger.error(err.message, err)
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
        logger.error(err.message, err)
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
        logger.error(err.message, err)
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
      logger.error(err.message, err)
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
        logger.error(err.message, err)
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
        logger.error(err.message, err)
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
      logger.error(err.message, err)
    }
  }
}

exports.supportHandlePhoneRetry = async agent => {
  const isLumpSum = await checkForLumpSum(agent)
  try {
    await handleContactCollection(agent, 'phone', isLumpSum)
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.supportHandleEmailRetry = async agent => {
  const isLumpSum = await checkForLumpSum(agent)
  try {
    await handleContactCollection(agent, 'email', isLumpSum)
  } catch (err) {
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
      logger.error(err.message, err)
    }
  } else {
    try {
      await handleCaseNumber(descriptionText, agent, caseNumber)
    } catch (err) {
      logger.error(err.message, err)
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
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
      logger.error(err.message, err)
    }
  } else {
    // Handle service desk errors?
    await agent.add(
      'Looks like something has gone wrong! Please try again or call please call <a href="tel:+18778824916">1-877-882-4916</a> to reach a support representative.'
    )
    await handleEndConversation(agent)
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
    logger.error(err.message, err)
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
    logger.error(err.message, err)
  }
}