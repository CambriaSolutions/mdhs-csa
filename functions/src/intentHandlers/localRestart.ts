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

const isPrevousIntentRootIntent = (agent) => {
  const userConversationPath = agent.context.get('previous-agent-states').parameters.userConversationPath
  const conversationPathLength = userConversationPath.length
  if (conversationPathLength > 1) {
    const lastIntent = userConversationPath[conversationPathLength - 2]
    return rootIntents.includes(lastIntent.name)
  } else {
    return true
  }
}

export const localRestart = async (agent, intentMap, subjectMatter) => {
  const currentIntent = agent.intent
  const currentIntentFunction = intentMap[currentIntent]
  const localRestartFunction = async () => {
    await currentIntentFunction(agent)
    if (isHomeEnabled(agent) && !isRootIntent(agent) && !isPrevousIntentRootIntent(agent)) {
      await agent.context.set({
        name: `${subjectMatter}-enableHome`,
        lifespan: 1,
      })

      await agent.add(new Suggestion('Home'))
    }
  }
  intentMap[currentIntent] = localRestartFunction
}