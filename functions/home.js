const { Suggestion } = require('dialogflow-fulfillment')

/**************************************************************************************************
 * home creates a new function in place of the current intent that adds a 'Home' suggestion button
 * and global-restart context.
 **************************************************************************************************/
exports.home = async (agent, intentMap, exclusionList = []) => {
  const currentIntentFunction = intentMap.get(agent.intent)
  const homeFunction = async () => {
    await currentIntentFunction(agent)
    if (!exclusionList.includes(agent.intent)) {
      await agent.add(new Suggestion('Home'))

      // Necessary to overwrite @sys.any
      await agent.context.set({
        name: 'waiting-global-restart',
        lifespan: 1,
      })
    }
  }
  intentMap.set(currentIntent, homeFunction)

  if (agent.intent === 'global-restart') {
    await agent.contexts.forEach(async context => {
      if (context.name !== 'previous-agent-states') {
        await agent.context.delete(context.name)
      }
    })
  }
}
