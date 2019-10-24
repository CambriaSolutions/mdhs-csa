/************************************************************************************************
 The snapshotCurrentIntent takes the agent as a parameter and continually appends the current 
 intent information to the userConversationPath parameter of the 'previous-intents' context.
************************************************************************************************/

const snapshotCurrentIntent = agent => {
  // Take a snapshot of the current intent
  const newIntentAndParams = {
    name: agent.intent,
    parameters: agent.parameters,
  }

  // Get the 'previous-intent' context
  let previousContexts = agent.context.get('previous-intents')

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

      // Remove the back Intent	that's at the end of the path.
      userConversationPath.pop()

      if (userConversationPath.length > 1) {
        userConversationPath.pop()
      }

      // Get the last intent in the array, set the agent parameters, match the intent name to
      // the function and call that function.
      const conversationPathLength = userConversationPath.length
      const lastIntent = userConversationPath[conversationPathLength - 1]
      agent.parameters = lastIntent.parameters
      const previousIntent = intentMap.get(lastIntent.name)
      await previousIntent(agent)
    } catch (err) {
      console.error(err)
    }
  }
}

/************************************************************************************************
	backIntent takes in an intentMap as a parameter and returns a function that is the fullfillment
	for the back functionality.
************************************************************************************************/
exports.backIntent = (agent, intentMap, name) => {
  snapshotCurrentIntent(agent)
  const back = backFunction(agent, intentMap)
  intentMap.set(name, back)
}
