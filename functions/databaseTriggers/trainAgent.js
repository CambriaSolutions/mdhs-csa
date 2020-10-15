require('dotenv').config()

/**
 * Trigger function on 'queriesForTraining' collection updates
 * to determine occurrence threshold for DF agent training
 */
module.exports = async (change, context) => {
  const admin = require('firebase-admin')
  const dialogflow = require('@google-cloud/dialogflow')

  const store = admin.firestore()
  const intentsClient = new dialogflow.IntentsClient()

  const docId = context.params.id
  const subjectMatter = context.params.subjectMatter
  const afterUpdateFields = change.after.data()
  const agentTrained = afterUpdateFields.agentTrained
  const occurrences = afterUpdateFields.occurrences
  const phrase = afterUpdateFields.phrase
  const intentId = afterUpdateFields.intent.id
  const intentName = afterUpdateFields.intent.name
  // If occurrences reaches 10 and agent is not trained
  if (occurrences >= 10 && agentTrained === false) {
    await trainAgent(store, intentsClient, phrase, intentId, docId, intentName, subjectMatter)
  }
  return afterUpdateFields
}

/**
 * Train DF agent
 * @param {*} phrase user phrase from db
 * @param {*} intentId matched intent id
 * @param {*} docId document id in firebase
 */
async function trainAgent(store, intentsClient, phrase, intentId, docId, intentName, subjectMatter) {
  try {
    let intent = await getIntent(intentsClient,
      `subjectMatters/${subjectMatter}/agent/intents/${intentId}`
    )

    let trainingPhrase = {
      parts: [
        {
          text: phrase,
        },
      ],
    }
    // add new training phrase in the intent list of training phrases
    intent.trainingPhrases.push(trainingPhrase)

    try {
      // updates the intent with intent object containing the new training phrase
      const request = {
        intent: intent,
        intentView: 'INTENT_VIEW_FULL',
      }

      await intentsClient.updateIntent(request)
      console.log('Updated intent with new training phrase.')

      // set agentTrained to true after we updated the intent
      // TODO - hardcoded cse
      await store
        .collection(
          '/subjectMatters/cse/queriesForTraining/'
        )
        .doc(docId)
        .update({ agentTrained: true })

      // save the phrase to the collection of auto trained phrases
      await store
        .collection(`/subjectMatters/${subjectMatter}/autoTrainedPhrases`)
        .add({
          intent: intentName,
          learnedPhrase: phrase,
        })

      console.log(`${intentName} learned ${phrase} as a training phrase`)

    } catch (e) {
      console.error('Unable to train intent', e)
    }
  } catch (err) {
    console.error('Unable to get intent', err)
  }
}

/**
 * Get DF intent data by intent id
 * @param {*} intentId
 */
async function getIntent(intentsClient, intentId) {
  try {
    let responses = await intentsClient.getIntent({
      name: intentId,
      intentView: 'INTENT_VIEW_FULL',
    })
    const response = responses[0]
    return response
  } catch (err) {
    console.error(`Unable to retrieve intent [${intentId}] from Dialogflow`, err)
    return err
  }
}