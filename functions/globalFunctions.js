exports.handleEndConversation = async agent => {
  await agent.add(`Can I help you with anything else?`)
  await agent.context.set({
    name: 'waiting-end-conversation',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-restart-conversation',
    lifespan: 2,
  })
}
