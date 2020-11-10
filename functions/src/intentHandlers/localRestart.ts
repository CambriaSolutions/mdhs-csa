import { Suggestion } from 'dialogflow-fulfillment'

const isHomeEnabled = (agent) => {
  return agent.context.get('cse-enableHome') !== undefined
    || agent.context.get('snap-enableHome') !== undefined
    || agent.context.get('tanf-enableHome') !== undefined
    || agent.context.get('wfd-enableHome') !== undefined
}

export const localRestart = async (agent, intentMap) => {
  const currentIntent = agent.intent
  const currentIntentFunction = intentMap[currentIntent]
  const localRestartFunction = async () => {
    await currentIntentFunction(agent)
    if (isHomeEnabled(agent)) {
      await agent.add(new Suggestion('Home'))
    }
  }
  intentMap[currentIntent] = localRestartFunction
}