const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')
const isNumber = require('lodash/isNumber')
const { handleEndConversation } = require('./globalFunctions.js')

exports.supportRoot = async agent => {
  try {
    await agent.add(
      `Got it. I have a few questions to make sure your request gets 
      to the right place. What's your first and last name?`
    )
    await agent.context.set({
      name: 'waiting-compts-name',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportValidateName = async agent => {
  const firstName = agent.parameters.firstName
  const lastName = agent.parameters.lastName

  // TODO: save data to db
  if (firstName && lastName) {
    try {
      await agent.add(
        `Thanks ${firstName}. What is your phone number
          so we can reach out to you with a solution?`
      )
      await agent.context.set({
        name: 'waiting-compts-phone-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'userinfo',
        lifespan: 100,
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
        name: 'waiting-compts-name',
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
      await agent.context.set({
        name: 'waiting-compts-email',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'userinfo',
        parameters: { phoneNumber: formattedPhone },
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
        name: 'waiting-compts-phone-number',
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
      await agent.context.set({
        name: 'waiting-compts-case-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'waiting-support-no-case-number',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'userinfo',
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
        name: 'waiting-compts-email',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportCaseNumber = async agent => {
  const caseNumber = agent.parameters.caseNumber

  if (!isNumber(caseNumber) || caseNumber === 0) {
    await agent.add(
      `I didn't catch that as a number, what is your case number?`
    )
    await agent.context.set({
      name: 'waiting-compts-case-number',
      lifespan: 3,
    })
  } else {
    // TODO: save data to db
    try {
      await agent.add(
        `Please describe your issue or request. You can use as many messages as
          you like - just click the "I'm Done" button when you are finished.`
      )
      await agent.context.set({
        name: 'waiting-compts-collect-issue',
        lifespan: 10,
      })
      await agent.context.set({
        name: 'userinfo',
        parameters: { caseNumber: caseNumber },
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.supportNoCaseNumber = async agent => {
  const caseNumber = 'Unknown case number'

  // TODO: save data to db
  try {
    await agent.add(
      `Please describe your issue or request. You can use as many messages as
          you like - just click the "I'm Done" button when you are finished.`
    )
    await agent.context.set({
      name: 'waiting-compts-collect-issue',
      lifespan: 10,
    })
    await agent.context.set({
      name: 'userinfo',
      parameters: { caseNumber: caseNumber },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportCollectIssue = async agent => {
  const complaint = agent.parameters.complaint
  const complaintsInContext = agent.context.get('complaints')
  let complaintCollection = []
  if (complaintsInContext) {
    const storedComplaints = complaintsInContext.parameters.complaints
    complaintCollection = [...storedComplaints, complaint]
  } else {
    complaintCollection.push(complaint)
  }

  try {
    await agent.add(
      `Feel free to add to your issue, or click or say "I'm done"`
    )
    await agent.add(new Suggestion(`I'm done`))
    await agent.context.set({
      name: 'complaints',
      lifespan: 5,
      parameters: { complaints: complaintCollection },
    })
    await agent.context.set({
      name: 'waiting-compts-collect-issue',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-compts-summarize-issue',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSummarizeIssue = async agent => {
  const rawComplaints = agent.context.get('complaints').parameters.complaints
  const filteredComplaints = rawComplaints.join(' ')
  const userinfo = agent.context.get('userinfo').parameters
  const firstName = userinfo.firstName
  const lastName = userinfo.lastName
  const caseNumber = userinfo.caseNumber
  const phoneNumber = userinfo.phoneNumber
  const email = userinfo.email

  if (
    filteredComplaints &&
    firstName &&
    lastName &&
    caseNumber &&
    phoneNumber
  ) {
    try {
      await agent.add(
        `Okay, I've put your request together. Here's what I've got.`
      )
      await agent.add(
        new Card({
          title: `Support Request`,
          text: `Full Name: ${firstName} ${lastName}
          Phone Number: ${phoneNumber}
          Email: ${email}
          Case Number: ${caseNumber}
          Message: ${filteredComplaints}`,
        })
      )
      await agent.add(new Suggestion(`Revise`))
      await agent.add(new Suggestion(`Submit`))
      await agent.context.set({
        name: 'waiting-compts-submit-issue',
        lifespan: 2,
      })
      await agent.context.set({
        name: 'waiting-compts-revise-issue',
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
      name: 'waiting-compts-collect-issue',
      lifespan: 5,
    })
    await agent.context.set({
      name: 'complaints',
      lifespan: 5,
      parameters: { complaints: [] },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.supportSumbitIssue = async agent => {
  const rawComplaints = agent.context.get('complaints').parameters.complaints
  const filteredComplaints = rawComplaints.join(' ')
  const userinfo = agent.context.get('userinfo').parameters
  const firstName = userinfo.firstName
  const lastName = userinfo.lastName
  const caseNumber = userinfo.caseNumber
  const phoneNumber = userinfo.phoneNumber
  const email = userinfo.email

  //TODO: send complaint data to service desk api
  try {
    await agent.add(`Thanks, your request has been submitted!`)
    await agent.add(
      new Card({
        title: `Support Request: [Ticket #]`,
        text: `Full Name: ${firstName} ${lastName}
        Phone Number: ${phoneNumber}
        Email: ${email}
        Case Number: ${caseNumber}
        Message: ${filteredComplaints}`,
      })
    )
    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
