const { handleEndConversation } = require('./globalFunctions.js')

exports.contactQANumber = async agent => {
  try {
    await agent.add(
      `The Child Support desk contact number is <a href="tel:+18778824916">877-882-4916</a>.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
