const { handleEndConversation } = require('./handleEndConversation.js')

exports.tbd = async agent => {
  const tbdMessage = 'At this time, I am not able to answer specific questions about your case. If you are seeking information MDHS programs, please visit www.mdhs.ms.gov or contact us <a href="https://www.mdhs.ms.gov/contact/" target="_blank">here</a>'

  await agent.add(tbdMessage)

  await handleEndConversation(agent)
}