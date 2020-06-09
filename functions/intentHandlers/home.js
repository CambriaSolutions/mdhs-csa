module.exports = async (agent, intentMap, exclusionList = []) => {
    const currentIntent = agent.intent
    const currentIntentFunction = intentMap.get(currentIntent)
    console.log(`${agent.intent} intent has handler ${currentIntentFullfillmentFunction}`);
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
  };