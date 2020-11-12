import { Suggestion } from 'dialogflow-fulfillment'

const rootIntents = [
  'Default Fallback Intent',
  'global-restart',
  'cse-root',
  'snap-root',
  'tanf-root',
  'wfd-root',
]

const isHomeEnabled = (agent) => {
  return agent.context.get('cse-subject-matter') !== undefined
    || agent.context.get('snap-subject-matter') !== undefined
    || agent.context.get('tanf-subject-matter') !== undefined
    || agent.context.get('wfd-subject-matter') !== undefined
}

const isRootIntent = (agent) => {
  return rootIntents.includes(agent.intent)
}

export const localRestart = async (agent, intentMap, subjectMatter) => {
  const currentIntent = agent.intent
  const currentIntentFunction = intentMap[currentIntent]
  const localRestartFunction = async () => {
    await currentIntentFunction(agent)
    if (isHomeEnabled(agent) && !isRootIntent(agent)) {
      await agent.context.set({
        name: `${subjectMatter}-enableHome`,
        lifespan: 1,
      })

      await agent.add(new Suggestion('Home'))
    }
  }
  intentMap[currentIntent] = localRestartFunction
}