import { Suggestion } from 'dialogflow-fulfillment'

const isHomeEnabled = (agent) => {
  return agent.context.get('cse-subject-matter') !== undefined
    || agent.context.get('snap-subject-matter') !== undefined
    || agent.context.get('tanf-subject-matter') !== undefined
    || agent.context.get('wfd-subject-matter') !== undefined
}

const isRootIntent = (agent) => {
  return agent.intent === 'cse-root'
    || agent.intent === 'snap-root'
    || agent.intent === 'tanf-root'
    || agent.intent === 'wfd-root'
}

export const localRestart = async (agent, intentMap) => {
  const currentIntent = agent.intent
  const currentIntentFunction = intentMap[currentIntent]
  const localRestartFunction = async () => {
    await currentIntentFunction(agent)
    if (isHomeEnabled(agent) && !isRootIntent(agent)) {
      await agent.add(new Suggestion('Home'))
    }
  }
  intentMap[currentIntent] = localRestartFunction
}