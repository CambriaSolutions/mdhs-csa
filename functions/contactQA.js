const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { supportRoot } = require('./support.js')

exports.contactQANumber = async agent => {
  try {
    // // Legacy
    await agent.add(
      `The Child Support desk contact number is <a href="tel:+18778824916">877-882-4916</a>.`
    )
    await handleEndConversation(agent)

    // Waiting for more information from MDHS
    // await agent.add(
    //   `Placeholder language for options to call or submit support request.`
    // )
    // await agent.add(new Suggestion(`Submit Support Request`))
    // await agent.add(new Suggestion(`Contact Number`))
    // await agent.add(new Suggestion(`Home`))
    // await agent.context.set({
    //   name: 'waiting-contact-support-handoff',
    //   lifespan: 2,
    // })
    // await agent.context.set({
    //   name: 'waiting-contact-provide-phone-number',
    //   lifespan: 2,
    // })
  } catch (err) {
    console.error(err)
  }
}

// Waiting for more information from MDHS
// exports.contactSupportHandoff = async agent => {
//   try {
//     await supportRoot(agent)
//   } catch (error) {
//     console.error(error)
//   }
// }

// exports.contactProvidePhoneNumber = async agent => {
//   try {
//     await agent.add(
//       ` The contact number for the Child Support Call Center is <a href="tel:+18778824916">877-882-4916</a>.`
//     )
//     await handleEndConversation(agent)
//   } catch (error) {
//     console.error(error)
//   }
// }
