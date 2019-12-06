const { Suggestion } = require('dialogflow-fulfillment')
/************************************************************************************************
 The snapshotCurrentIntent takes the agent as a parameter and continually appends the current 
 intent information to the userConversationPath parameter of the 'previous-intents' context.
************************************************************************************************/

const snapshotCurrentIntent = agent => {
  // Grab all the existing contexts except for 'previous-intents'
  let currentContexts = []
  agent.contexts.forEach(context => {
    if (context.name !== 'previous-intents') {
      currentContexts.push(context)
    }
  })

  // Take a snapshot of the conversation.
  const newIntentAndParams = {
    name: agent.intent,
    parameters: agent.parameters || {},
    contexts: currentContexts,
  }
  // Get the 'previous-intent' context
  const previousContexts = agent.context.get('previous-intents')

  /* If the 'previous-intent' context is undefined aka it is the first time
	the context is being set, set 'previous-intents' to the an array with
	the first element as the current intent name and parameters. Else,
	append the current intent name and parameters to the the 
	userConversationPath parameter.*/
  if (previousContexts === undefined) {
    agent.context.set({
      name: 'previous-intents',
      lifespan: 99999,
      parameters: {
        userConversationPath: [newIntentAndParams],
      },
    })
  } else {
    const previousIntentsAndParams =
      previousContexts.parameters.userConversationPath

    agent.context.set({
      name: 'previous-intents',
      parameters: {
        userConversationPath: previousIntentsAndParams.concat(
          newIntentAndParams
        ),
      },
    })
  }
}

const backFunction = (agent, intentMap) => {
  return async () => {
    try {
      let userConversationPath = agent.context.get('previous-intents')
        .parameters.userConversationPath

      // Clear all the contexts that are currently set.
      agent.contexts.forEach(context => {
        if (context.name !== 'previous-intents') {
          agent.context.delete(context.name)
        }
      })

      // Remove the back Intent	that's at the end of the path.
      userConversationPath.pop()

      // Remove the intent where the user wants to move back from.
      if (userConversationPath.length > 1) {
        userConversationPath.pop()
      }

      // Get the last intent in the array, set the agent parameters, match the intent name to
      // the function and call that function.
      const conversationPathLength = userConversationPath.length
      const lastIntent = userConversationPath[conversationPathLength - 1]

      agent.intent = lastIntent.name
      agent.parameters = lastIntent.parameters
      lastIntent.contexts.forEach(context => {
        if (context.name !== 'previous-intents') {
          agent.context.set(context)
        }
      })

      const previousIntent = intentMap.get(lastIntent.name)
      await previousIntent(agent)
    } catch (err) {
      console.error(err)
    }
  }
}

exports.fullfillmentWrapper = (agent, intentMap) => {
  const currentIntentFullfillmentFunction = intentMap.get(agent.intent)
  const maskFunction = async agent => {
    await currentIntentFullfillmentFunction(agent)
    let prevContexts = agent.context.get('previous-intents')
    if (
      prevContexts &&
      prevContexts.parameters.userConversationPath.length > 1
    ) {
      await agent.add(new Suggestion('Go Back'))
    }
  }
  intentMap.set(agent.intent, maskFunction)
}

const backIntentCycle = (agent, intentMap, name, isSysAny) => {
  if (!isSysAny) {
    snapshotCurrentIntent(agent)
  }
  const back = backFunction(agent, intentMap)
  intentMap.set(name, back)
}

/************************************************************************************************
  backIntent takes in an webHookClient, intentMap, intent name, and a boolean as a parameter and 
  returns a function that is the fullfillment for the back functionality.
************************************************************************************************/
exports.backIntent = (
  agent,
  intentMap,
  {
    intentResetList = [],
    isSysAny = false,
    backIntentName = 'go-back',
    addButton = true,
  } = {}
) => {
  if (intentResetList !== []) {
    const prevIntents = agent.context.get('previous-intents')
    if (intentResetList.includes(agent.intent)) {
      if (prevIntents !== undefined) {
        agent.context.delete('previous-intents')
      }
      return
    } else {
      backIntentCycle(agent, intentMap, backIntentName, isSysAny)
    }
  } else {
    backIntentCycle(agent, intentMap, backIntentName, isSysAny)
  }
  if (addButton) {
    this.fullfillmentWrapper(agent, intentMap)
  }
}

exports.setBackContext = async agent => {
  try {
    await agent.context.set({
      name: 'waiting-go-back-any',
      lifespan: 1,
    })
  } catch (err) {
    console.error(err)
  }
}
