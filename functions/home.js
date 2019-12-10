const { Suggestion } = require('dialogflow-fulfillment')

exports.homeButton = (agent, intentMap, exclusionList = []) => {
  if (!exclusionList.includes(agent.intent)) {
    const currentIntent = agent.intent
    const currentIntentFunction = intentMap.get(currentIntent)
    const homeFunction = async () => {
      await currentIntentFunction(agent)
      await agent.add(new Suggestion('Home'))
      await agent.context.set({
        name: 'waiting-global-restart',
        lifespan: 1,
      })
    }
    intentMap.set(currentIntent, homeFunction)
  }
}
