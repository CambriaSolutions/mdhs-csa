const validator = require('validator')
const { parsePhoneNumberFromString } = require('libphonenumber-js/min')
const { Suggestion } = require('dialogflow-fulfillment')

// Used to handle restarting and starting conversations for support requests
exports.startSupportConvo = async agent => {
  try {
    await agent.add(`Which of the following are you?`)
    await agent.add(
      new Suggestion(`Parent who is to receive child support payments`)
    )
    await agent.add(
      new Suggestion(`Parent who is to pay child support payments`)
    )
    await agent.add(new Suggestion(`Employer`))

    await agent.context.set({
      name: 'waiting-support-parent-receiving',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-parent-paying',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-employer',
      lifespan: 3,
    })

    // Clear out context in case of multiple tickets
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 0,
    })
  } catch (err) {
    console.error(err)
  }
}

// Format the confirmation responses based on type of support request
exports.formatConfirmationResponse = async agent => {
  const supportType = await agent.context
    .get('ticketinfo')
    .parameters.supportType.toLowerCase()

  let confimationResponse
  // Request contempt action
  if (supportType === 'request contempt action') {
    confimationResponse = `Thanks, your request has been submitted! We will review the case for possible contempt actions. If more information is needed, we will mail you a contempt packet within 1-2 business days.`
  }
  // Child support payment increase or decrease
  else if (supportType === 'child support increase or decrease') {
    confimationResponse = `Thanks, your request has been submitted and will be reviewed. If we need more information to proceed with your request, we will contact you within 1-2 business days.`
  }
  // Change of personal information
  else if (supportType === 'change personal information') {
    confimationResponse = `Thanks, your request has been submitted. A member of our team will reach out to you within 1-2 business days to validate your request.`
  }
  // Change of employment status
  else if (supportType === 'change of employment status') {
    confimationResponse = `Thanks, your request has been submitted! A member of our team will process this information. If we need more information, we will contact you at the number provided.`
  }
  // Request payment history
  else if (supportType === 'request payment history or record') {
    confimationResponse = `Thanks, your request has been submitted! We will mail you a statement of accounting to the address we have in our system. If we need more information to process this request, we will contact you in the next 1-2 days.`
  }
  // Information about parent who pays child support
  else if (
    supportType === 'information about the parent who pays child support'
  ) {
    confimationResponse = `Thanks, your request has been submitted! A member of our team will process this information. If we need more information, we will contact you at the number provided.`
  }
  // Request case closure
  else if (supportType === 'request case closure') {
    confimationResponse = `Thanks, your request has been submitted! A member of our team will reach out within 1-2 business days to validate your request.`
  }
  // Employer reports a lump sum payment
  else if (supportType === 'employer report lump sum notification') {
    confimationResponse = `Thanks, your request has been submitted. A member of our team will reach out within 1-2 business days to respond to your request.`
  }
  // Adding an authorized user to an account
  else if (supportType === 'add authorized user') {
    confimationResponse = `Thanks, your request has been submitted! A member of our team will reach out within 1-2 business days to validate your request.`
  }
  // Any other type of request
  else {
    confimationResponse = `Thanks, your request has been submitted and will be reviewed. If we need more information to proceed with your request, we will contact you within 1-2 business days.`
  }
  return confimationResponse
}

// Responds to case number and sets context appropriately
exports.handleCaseNumber = async (descriptionText, agent, caseNumber) => {
  const employmentChangeType = await agent.context.get('ticketinfo').parameters
    .employmentChangeType

  let change
  if (employmentChangeType) {
    change = employmentChangeType.toLowerCase()
  }

  if (change === 'change of employer' || change === 'loss of employer') {
    try {
      await agent.add(`What is the new employer's name?`)
      await agent.context.set({
        name: 'waiting-support-collect-new-employer-name',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-support-no-new-employer',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { caseNumber },
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await agent.add(
        `${descriptionText} You can use as many messages as you like - just click the "I'm Done" button when you are finished.`
      )
      await agent.context.set({
        name: 'waiting-support-collect-issue',
        lifespan: 10,
      })
      await agent.context.set({
        name: 'ticketinfo',
        parameters: { caseNumber },
      })
    } catch (err) {
      console.error(err)
    }
  }
}

// Accept what type of support request, and funnels appropriately
exports.supportMoreOptions = async (agent, option) => {
  try {
    if (option === 'receiving') {
      await agent.add(
        `I can help parents receiving payments with the following additional requests. If you don't see what you need, select "None of These".`
      )
      await agent.add(
        new Suggestion(`Information about the parent who pays child support`)
      )
      await agent.add(new Suggestion(`Request Payment History`))
      await agent.add(new Suggestion(`Add Authorized User`))
      await agent.add(new Suggestion(`None of These`))
    } else if (option === 'paying') {
      await agent.add(
        `I can help parents making payments with the following additional requests. If you don't see what you need, select "None of These".`
      )
      await agent.add(new Suggestion(`Request Payment History`))
      await agent.add(new Suggestion(`Add Authorized User`))
      await agent.add(new Suggestion(`None of These`))
    }
    await agent.context.set({
      name: 'waiting-support-type',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-support-general-inquiries',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// Checks for the inclusion of lump sum in order to change the conversation
exports.checkForLumpSum = async agent => {
  const supportType = await agent.context.get('ticketinfo').parameters
    .supportType
  const isLumpSum = supportType.includes('lump')
  return isLumpSum
}

// Used to request the case number
const requestCaseNumber = async agent => {
  try {
    await agent.add(
      `What is your case number? Please do not provide your social security number.`
    )

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
}

// Used to request a company for a lump sum notification
const requestCompany = async agent => {
  try {
    await agent.add(`What is the name of your company/employer?`)

    await agent.context.set({
      name: 'waiting-support-collect-company',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// Used to handle the collection of either an email or phone number
// after the user has been reminded that they need to submit either type
exports.handleContactCollection = async (agent, type, isLumpSum) => {
  if (type === 'phone') {
    const phoneNumberResponse = agent.parameters.phoneNumber
    const formattedPhone = `+1${phoneNumberResponse}`
    const isValidPhone = validator.isMobilePhone(formattedPhone, 'en-US')

    if (isValidPhone) {
      // The number is valid, so we format it to store in context
      const phoneNumber = parsePhoneNumberFromString(
        formattedPhone
      ).formatNational()

      if (!isLumpSum) {
        // Not a lump sum reporting, so we gather the case number
        try {
          await requestCaseNumber(agent)
          await agent.context.set({
            name: 'ticketinfo',
            parameters: { phoneNumber },
          })
        } catch (err) {
          console.error(err)
        }
      } else {
        // Its a lump sum reporting, so we collect the company name
        try {
          await requestCompany(agent)
          await agent.context.set({
            name: 'ticketinfo',
            parameters: { phoneNumber },
          })
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      // Failed to validate phone number
      try {
        await agent.add(
          `I didn't recognize that as a phone number, starting with area code, what is your phone number?`
        )
        await agent.context.set({
          name: 'waiting-support-handle-phone-retry',
          lifespan: 3,
        })
      } catch (err) {
        console.error(err)
      }
    }
  } else if (type === 'email') {
    // Retrieve and validate email address provided
    const email = agent.parameters.email
    const isValid = validator.isEmail(email)

    if (isValid) {
      // Not a lump sum reporting, so we gather the case number
      if (!isLumpSum) {
        try {
          await requestCaseNumber(agent)
          await agent.context.set({
            name: 'ticketinfo',
            parameters: { email: email },
          })
        } catch (err) {
          console.error(err)
        }
      } else {
        // Its a lump sum reporting, so we collect the company name
        try {
          await requestCompany(agent)
          await agent.context.set({
            name: 'ticketinfo',
            parameters: { email: email },
          })
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      // Failed to validate email, so we retry
      try {
        await agent.add(
          `I didn't recognize that as an email address, could you say that again?`
        )
        await agent.context.set({
          name: 'waiting-support-handle-email-retry',
          lifespan: 3,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
}
