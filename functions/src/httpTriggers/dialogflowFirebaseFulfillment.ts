const isActionRequested = (body, action) => {
  if (body.queryResult !== undefined && body.queryResult.queryText !== undefined) {
    return body.queryResult.queryText.toLowerCase() === action.toLowerCase()
  }

  return false
}

// Regex to retrieve text after last "/" on a path
const getIdFromPath = path => /[^/]*$/.exec(path)[0]

const saveRequest = async (reqData, subjectMatter) => {
  const admin = await import('firebase-admin')
  const db = admin.firestore()

  const intentId = getIdFromPath(reqData.queryResult.intent.name)
  const _reqData = {
    ...reqData,
    createdAt: admin.firestore.Timestamp.now(),
    intentId
  }

  let currentSubjectMatter = subjectMatter
  if (currentSubjectMatter === undefined || currentSubjectMatter === '') {
    currentSubjectMatter = 'general'
  }

  return db.collection(`subjectMatters/${currentSubjectMatter}/requests`).add(_reqData)
}

const constructIntentHandlersObject = async (intentName, request, subjectMatter) => {

  const { getIntentHandler } = await import('../intentHandlers/getIntentHandler')

  const { getTextResponses, getSuggestions, genericHandler, shouldHandleEndConversation } = await import('../utils/fulfillmentMessages')

  const intentHandler = await getIntentHandler(subjectMatter)(intentName)

  const genericIntentHandler = async (_agent) => {
    const dialogflowTextResponses = getTextResponses(request.body.queryResult.fulfillmentMessages)
    const dialogflowSuggestions = getSuggestions(request.body.queryResult.fulfillmentMessages)

    await genericHandler(_agent, dialogflowTextResponses, dialogflowSuggestions)

    if (shouldHandleEndConversation(request.body.queryResult.fulfillmentMessages)) {
      const { handleEndConversation } = await import('../intentHandlers/globalFunctions')
      await handleEndConversation(_agent)
    }
  }

  return ({
    // The current intent always needs a handler, so we create a default placeholder
    // If the intent has an actual handler, the default will be overwritten by the proceeding
    // spread objects
    [intentName]: intentHandler ? intentHandler : genericIntentHandler
  })
}

export const dialogflowFirebaseFulfillment = async (request, response) => {
  try {
    if (request.method === 'GET' && request.query.healthCheck) {
      // Using a health check endpoint to keep the function warm
      response.status(200).send()
    } else {
      // Doing all imports inside of function to hopefully minimize cold start issues
      const { WebhookClient } = await import('dialogflow-fulfillment')
      const { back } = await import('../intentHandlers/back')
      const { globalRestart } = await import('../intentHandlers/globalRestart')
      const { localRestart } = await import('../intentHandlers/localRestart')

      const { getSubjectMatter } = await import('../utils/getSubjectMatter')

      if (request.body.queryResult.fulfillmentMessages) {
        // If request contains a custom payload, it is necessary that each object in the fulfillmentMessages array
        // include a "platform" property. Must happen before instantiating the WebhookClient
        request.body.queryResult.fulfillmentMessages = request.body.queryResult.fulfillmentMessages.map(m => ({
          ...m,
          platform: m.platform ? m.platform : 'PLATFORM_UNSPECIFIED'
        }))
      }

      const agent = new WebhookClient({ request, response }) as any

      const subjectMatter = getSubjectMatter(agent)

      const savingRequest = saveRequest(request.body, subjectMatter)

      const intentName = request.body.queryResult.intent.displayName

      const intentHandlers = await constructIntentHandlersObject(intentName, request, subjectMatter)

      // List of intents what will reset the back button context
      const resetBackIntentList = [
        'Default Welcome Intent',
        'cse-support-submit-issue',
      ]

      const resetStartOverIntentList = [
        'Default Welcome Intent',
        'restart-conversation',
        'global-restart',
        'acknowledge-privacy-statement'
      ]

      // Check to see if we need to override the target intent
      // In case of Start Over and Go Back this may be needed during parameter entry.
      // Home and Start Over are essentially the same button, but which we
      // receive is based the version of the front end plug in. That is why we check for both
      if (isActionRequested(request.body, 'Start Over') && agent.context.get('waiting-global-restart') !== undefined) {
        agent.intent = 'global-restart'
      } else if (isActionRequested(request.body, 'Go Back') && agent.context.get('waiting-go-back') !== undefined) {
        agent.intent = 'go-back'
      }

      await localRestart(agent, intentHandlers, subjectMatter)

      await back(agent, intentHandlers, request.body.queryResult.fulfillmentMessages, subjectMatter, resetBackIntentList, 'go-back')
      await globalRestart(agent, intentHandlers, resetStartOverIntentList)

      await savingRequest

      await agent.handleRequest(new Map(Object.entries(intentHandlers)))
    }
  }
  catch (e) {
    console.error(e.message, e)
    response.status(500).send(e.message)
  }
}