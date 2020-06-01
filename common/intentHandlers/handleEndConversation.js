const { Suggestion } = require('dialogflow-fulfillment')

exports.handleEndConversation = async agent => {
  const helpMessage = `Is there anything else I can help you with today?`

  await agent.add(helpMessage)
  await agent.add(new Suggestion(`Submit Feedback`))

  await agent.context.set({
    name: 'waiting-feedback-root',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-restart-conversation',
    lifespan: 2,
  })
}