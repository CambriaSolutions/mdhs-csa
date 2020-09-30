exports.contactQANumber = async agent => {
  try {
    const { Suggestion } = require('dialogflow-fulfillment')

    await agent.add(
      'I can help you submit service requests and prevent you from waiting on hold. To submit a request, please click below. To see our customer service number, please click “Customer Service”.'
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Customer Service'))
    await agent.context.set({
      name: 'waiting-contact-support-handoff',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-contact-provide-phone-number',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.contactSupportHandoff = async agent => {
  const { supportRoot } = require('./support.js')

  try {
    await supportRoot(agent)
  } catch (error) {
    console.error(error)
  }
}

exports.contactProvidePhoneNumber = async agent => {
  try {
    const { handleEndConversation } = require('../globalFunctions')

    await agent.add(
      'The contact number for child support customer service is <a href="tel:+18778824916">1-877-882-4916</a>.'
    )
    await handleEndConversation(agent)
  } catch (error) {
    console.error(error)
  }
}
