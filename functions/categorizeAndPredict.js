require('dotenv').config()
const automl = require('@google-cloud/automl')
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment')

// Instatiate autoML client
const client = new automl.v1beta1.PredictionServiceClient({
  client_email: `${process.env.AUTOML_CLIENT_EMAIL}`,
  private_key: `${process.env.AUTOML_PRIVATE_KEY.replace(/\\n/g, '\n')}`,
})

// Mapping ML categories to intent suggestions
const { mapCategoryToIntent } = require('./mapCategoryToIntent.js')

const predictCategories = async query => {
  // Define the location of the category prediction model
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
  // Define the location of the subject matter model
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

const categorizeAndPredict = async query => {
  // Query both models to determine
  // 1. Is this applicable to the subject matter we handle?
  // 2. What category is the query most likely to match?

  const modelPromises = [predictCategories(query), predictSubjectMatter(query)]
  const results = await Promise.all(modelPromises)

  // Check the responses to
  const appliesToChildSupport = results.find(
    result =>
      result.predictionType === 'subjectMatter' &&
      result.labels === 'child-support'
  )

  if (appliesToChildSupport) {
    // Remove the subject matter prediction
    return results.filter(result => {
      return result.predictionType !== 'subjectMatter'
    })
  }
}

exports.handledUnhandled = async agent => {
  try {
    const { query } = agent

    // Send the user's query to interact with our custom machine learning models
    const categories = await categorizeAndPredict(query)

    // If there are categories returned, map them to intents,
    // and present them to the user as suggestions
    if (categories) {
      const categoriesAndConfidence = categories[0].labels
      const suggestions = []
      for (const category of Object.keys(categoriesAndConfidence)) {
        const { name, confidence } = categoriesAndConfidence[category]
        if (confidence > 0.01) {
          const suggestionText = mapCategoryToIntent(name)
          if (suggestionText !== '') {
            suggestions.push(suggestionText)
          }
        }
      }
      await agent.add(
        `I'm sorry, were you referring to one of the topics below?`
      )
      console.log(suggestions)
      suggestions.forEach(async suggestion => {
        await agent.add(new Suggestion(suggestion))
      })

      // Save the query and suggestions in context for further analysis
      // on the analytics end
      await agent.context.set({
        name: 'should-inspect-ml',
        lifespan: 1,
        parameters: {
          originalQuery: query,
          suggestions: suggestions,
        },
      })
    } else {
      // The query was not in the realm of our subject matter,
      // handle with default fallback language
      await agent.add(
        `I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.`
      )
      await agent.add(new Suggestion(`Home`))
    }
  } catch (err) {
    console.error(err)
  }
}
