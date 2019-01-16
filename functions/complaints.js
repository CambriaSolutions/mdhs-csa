const { Suggestion } = require('dialogflow-fulfillment')
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
      await agent.context.set({
        name: 'waiting-compts-phone-number',
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
      await agent.context.set({
        name: 'waiting-compts-case-number',
        lifespan: 2,
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
  const validCaseNumber = caseNumber.length === 6
  // TODO: save data to db
  if (validCaseNumber) {
    try {
      await agent.add(
        `Please describe your issue. You can use as many messages as
        you like - just click the "I'm Done" button when you are finished.`
      )
      await agent.context.set({
        name: 'waiting-compts-issue',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  }
}
