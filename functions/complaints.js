const { Suggestion, Card } = require('dialogflow-fulfillment')
const validator = require('validator')

exports.comptsRoot = async agent => {
  try {
    await agent.add(
      `Got it. I have a few questions to make sure your request gets 
      to the right place. What's your first and last name?`
    )
    await agent.add(new Suggestion('John Doe'))
    await agent.context.set({
      name: 'waiting-compts-name',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.comptsValidateName = async agent => {
  const firstName = agent.parameters.firstName
  const lastName = agent.parameters.lastName

  // TODO: save data to db
  if (firstName && lastName) {
    try {
      await agent.add(
        `Thanks. What is your phone number
          so we can reach out to you with a solution?`
      )
      await agent.add(new Suggestion('9163264446'))
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
      await agent.add(new Suggestion('John Doe'))
      await agent.context.set({
        name: 'waiting-compts-name',
        lifespan: 2,
      })
    } catch (err) {
      console.error(err)
    }
  }
}

exports.comptsPhoneNumber = async agent => {
  const phoneNumber = agent.parameters.phoneNumber
  const formattedPhone = `+1${phoneNumber}`
  const isValid = validator.isMobilePhone(formattedPhone, 'en-US')

  // TODO: save data to db
  if (isValid) {
    try {
      await agent.add(`What is your case number?`)
      await agent.add(new Suggestion('123456'))
      await agent.context.set({
        name: 'waiting-compts-case-number',
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

exports.comptsCaseNumber = async agent => {
  const caseNumber = agent.parameters.caseNumber

  // TODO: save data to db
  try {
    await agent.add(
      `Please describe your issue. You can use as many messages as
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

exports.comptsCollectIssue = async agent => {
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
    await agent.add(new Suggestion(`I'm Done`))
    await agent.context.set({
      name: 'complaints',
      lifespan: 2,
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

exports.comptsSummarizeIssue = async agent => {
  const rawComplaints = agent.context.get('complaints').parameters.complaints
  const filteredComplaints = rawComplaints.join(' ')
  const userinfo = agent.context.get('userinfo').parameters
  const firstName = userinfo.firstName
  const lastName = userinfo.lastName
  const caseNumber = userinfo.caseNumber
  const phoneNumber = userinfo.phoneNumber

  if (
    filteredComplaints &&
    firstName &&
    lastName &&
    caseNumber &&
    phoneNumber
  ) {
    try {
      await agent.add(`Here's what I've got.`)
      await agent.add(
        new Card({
          title: `New Complaint`,
          text: `Full Name: ${firstName} ${lastName}
          Phone Number: ${phoneNumber}
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

exports.comptsReviseIssue = async agent => {
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
      lifespan: 2,
      parameters: { complaints: [] },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.comptsSumbitIssue = async agent => {
  const rawComplaints = agent.context.get('complaints').parameters.complaints
  const filteredComplaints = rawComplaints.join(' ')
  const userinfo = agent.context.get('userinfo').parameters
  const firstName = userinfo.firstName
  const lastName = userinfo.lastName
  const caseNumber = userinfo.caseNumber
  const phoneNumber = userinfo.phoneNumber

  //TODO: send complaint data to service desk api
  try {
    await agent.add(
      new Card({
        title: `New Complaint`,
        text: `Full Name: ${firstName} ${lastName}
        Phone Number: ${phoneNumber}
        Case Number: ${caseNumber}
        Message: ${filteredComplaints}`,
      })
    )
    await agent.add(
      `Thanks, your request has been submitted! Is there anything else I can help you with?`
    )
  } catch (err) {
    console.error(err)
  }
}
