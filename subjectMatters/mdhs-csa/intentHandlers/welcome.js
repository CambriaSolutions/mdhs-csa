const { Suggestion } = require('dialogflow-fulfillment')

exports.welcome = async agent => {
  try {
    await agent.add(
      `Hi, I'm Gen. I am not a real person, but I can help you with common child support requests. Are you here to get help with Child Support?`
    )
    await disableInput(agent)
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-not-child-support',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-yes-child-support',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}