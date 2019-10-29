require('dotenv').config()
const automl = require('@google-cloud/automl')
const client = new automl.v1beta1.PredictionServiceClient({})

const predictCategories = async query => {
  const categoryModelPath = client.modelPath(
    process.env.AUTOML_PROJECT,
    process.env.AUTOML_LOCATION,
    process.env.AUTOML_CAT_MODEL
  )
  const payload = {
    textSnippet: {
      content: query,
      mime_type: 'text/plain',
    },
  }

  const catRequest = {
    name: categoryModelPath,
    payload: payload,
  }

  const catResponses = await client.predict(catRequest)
  return {
    predictionType: 'categories',
    labels: {
      category1: {
        name: catResponses[0].payload[0].displayName,
        confidence: catResponses[0].payload[0].classification.score,
      },
      category2: {
        name: catResponses[0].payload[1].displayName,
        confidence: catResponses[0].payload[1].classification.score,
      },
      category3: {
        name: catResponses[0].payload[2].displayName,
        confidence: catResponses[0].payload[2].classification.score,
      },
    },
  }
}

const predictSubjectMatter = async query => {
  const subjectMatterModelPath = client.modelPath(
    process.env.AUTOML_PROJECT,
    process.env.AUTOML_LOCATION,
    process.env.AUTOML_SM_MODEL
  )
  const payload = {
    textSnippet: {
      content: query,
      mime_type: 'text/plain',
    },
  }

  const smRequest = {
    name: subjectMatterModelPath,
    payload: payload,
  }

  const smResponses = await client.predict(smRequest)
  return {
    predictionType: 'subjectMatter',
    labels: smResponses[0].payload[0].displayName,
  }
}

exports.categorizeAndPredict = async query => {
  const modelPromises = [predictCategories(query), predictSubjectMatter(query)]
  const results = await Promise.all(modelPromises)
  const category = results.find(
    result =>
      result.predictionType === 'subjectMatter' &&
      result.labels === 'child-support'
  )

  if (category) {
    return results.filter(result => {
      return result.predictionType !== 'subjectMatter'
    })
  }
}
