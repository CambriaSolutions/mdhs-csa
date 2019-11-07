require('dotenv').config()
const automl = require('@google-cloud/automl')
const { Suggestion } = require('dialogflow-fulfillment')

// Instantiate autoML client
const client = new automl.v1beta1.PredictionServiceClient({
  credentials: {
    client_email: `${process.env.AUTOML_CLIENT_EMAIL}`,
    private_key: `${process.env.AUTOML_PRIVATE_KEY.replace(/\\n/g, '\n')}`,
  },
  projectId: process.env.AUTOML_PROJECT,
})

// Mapping ML categories to intent suggestions
const { mapCategoryToIntent } = require('./mapCategoryToIntent.js')

// Query the category model to return category predictions
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
    categories: {
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

// Query the subject matter model to return what subject matter the query
// belongs to
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
    categories: smResponses[0].payload[0].displayName,
  }
}

// Query both models to determine
// 1. Is this applicable to the subject matter we handle?
// 2. What category is the query most likely to match?
const categorizeAndPredict = async query => {
  const modelPromises = [predictCategories(query), predictSubjectMatter(query)]
  const results = await Promise.all(modelPromises)

  // Check the responses to determing if this query applies to child support
  const appliesToChildSupport = results.find(
    result =>
      result.predictionType === 'subjectMatter' &&
      result.categories === 'child-support'
  )

  const predictions = results.find(
    result => result.predictionType === 'categories'
  )

  const categories = []
  if (appliesToChildSupport) {
    for (const category in predictions.categories) {
      const { name, confidence } = predictions.categories[category]

      // TODO: determine threshold, it is low now for testing purposes
      if (confidence > 0.01) {
        categories.push(name)
      }
    }
  }
  return categories
}

exports.handleUnhandled = async agent => {
  try {
    const { query } = agent

    // Send the user's query to interact with our custom machine learning models
    const categories = await categorizeAndPredict(query)

    // If there are categories returned, attempt to map them to intents,
    // and present them to the user as suggestions
    if (categories.length > 0) {
      // Use the ML categories to retrieve associated suggestions from the db
      const suggestions = await mapCategoryToIntent(categories)

      if (suggestions.length > 0) {
        // TODO: Determine non-suggestion text
        await agent.add(
          `I'm sorry, were you referring to one of the topics below?`
        )

        suggestions.forEach(async suggestion => {
          if (suggestion.suggestionText) {
            await agent.add(new Suggestion(suggestion.suggestionText))
          }
        })

        // Save the query and suggestion and intent collection in context for
        // further analysis on the analytics end
        await agent.context.set({
          name: 'should-inspect-for-ml',
          lifespan: 1,
          parameters: {
            originalQuery: query,
            suggestions: suggestions,
          },
        })
      } else {
        // The query did not return any suggestions
        // handle with default fallback language
        await agent.add(
          `I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.`
        )
        await agent.add(new Suggestion(`Home`))
      }
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
