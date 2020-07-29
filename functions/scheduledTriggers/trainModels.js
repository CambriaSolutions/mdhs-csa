require('dotenv').config()
const admin = require('firebase-admin')
const automl = require('@google-cloud/automl')
const format = require('date-fns/format')
const store = admin.firestore()

// Instantiate autoML client
const client = new automl.v1beta1.AutoMlClient({
  projectId: process.env.AUTOML_MDHS_PROJECT_ID,
  keyFilename: './mdhs-key.json'
})

/**
 * Trigger training weekly
 **/
module.exports = async () => {
  const subjectMatter = 'cse'
  const snap = await store
    .collection(`/subjectMatters/${subjectMatter}/queriesForTraining/`)
    .where('occurrences', '>=', 10)
    .where('categoryModelTrained', '==', false)
    .get()

  const queriesToTrain = snap.size
  console.log(`Identified ${queriesToTrain} queries to train.`)

  if (queriesToTrain > 0) {
    // Train the model
    await trainCategoryModel(subjectMatter)

    // Update training status in individual queries
    const docUpdatePromises = []
    snap.forEach(async doc => {
      docUpdatePromises.push(store
        .collection(`/subjectMatters/${subjectMatter}/queriesForTraining`)
        .doc(doc.id)
        .update({ categoryModelTrained: true }, { merge: true }))
    })
    await Promise.all(docUpdatePromises)
  } else {
    console.log('Training was skipped.')
  }
}

// --------------------------------  TRAIN CATEGORY MODEL  --------------------------------

/**
 * Train Category Model
 * @param {*} intent
 */
async function trainCategoryModel(subjectMatter) {
  const datasetId = process.env.AUTOML_MDHS_DATASET_ID
  const date = format(new Date(), 'MM_DD_YYYY')
  const modelName = `mdhs_${subjectMatter}_${date}`

  const projectLocation = client.locationPath(process.env.AUTOML_MDHS_PROJECT_ID, 'us-central1')

  // Set model name and model metadata for the dataset.
  const modelData = {
    displayName: modelName,
    datasetId: datasetId,
    textClassificationModelMetadata: {},
  }

  // Create a model with the model metadata in the region.
  try {
    const [operation, initialApiResponse] = await client.createModel({
      parent: projectLocation,
      model: modelData,
    })

    console.log(`Training operation name: ${initialApiResponse.name}`)
    console.log('Training started...')

    // Update training status in db
    await store
      .collection('/subjectMatters/')
      .doc(`${subjectMatter}`)
      .update({
        isTrainingProcessing: true,
      })

    const [model] = await operation.promise()

    // Retrieve deployment state.
    let deploymentState = ''

    if (model.deploymentState === 1) {
      deploymentState = 'deployed'

      // Update training status in db
      await store
        .collection('/subjectMatters/')
        .doc(`${subjectMatter}`)
        .update({
          isTrainingProcessing: false,
          lastTrained: admin.firestore.Timestamp.now(),
        })
    } else if (model.deploymentState === 2) {
      deploymentState = 'undeployed'
    }

    // Model information needed to review details in the GCP console
    console.log(`Model name: ${model.name}`)
    console.log(`Model deployment state: ${deploymentState}`)
  } catch (err) {
    console.log(err)

    await store
      .collection('/subjectMatters/')
      .doc(`${subjectMatter}`)
      .update({
        isTrainingProcessing: false,
      })
  }
}
