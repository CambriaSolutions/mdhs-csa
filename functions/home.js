const { Suggestion } = require('dialogflow-fulfillment')

/**************************************************************************************************
 * home creates a new function in place of the current intent that adds a 'Home' suggestion button
 * and global-restart context.
 **************************************************************************************************/
exports.home = (agent, intentMap, exclusionList = []) => {
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
