require('dotenv').config()

// require fallback data from start date to end date
const queries = require('./dataFiles/fallbackFullDetails_08-01_09-01')

const fs = require('fs')
const language = require('@google-cloud/language')
const client = new language.LanguageServiceClient()

// Get entities
const getEntities = async query => {
  const entitiesArray = []
  if (query.messageText && query.messageText.toLowerCase() !== 'no') {
    // Instantiates a client
    const individualDoc = {
      content: query.messageText,
      type: 'PLAIN_TEXT',
    }
    const [result] = await client.analyzeEntities({ document: individualDoc })
    const entities = result.entities

    entities.forEach(entity => {
      entitiesArray.push(entity.name)
    })
  }

  return { entitiesArray, message: query.messageText }
}

const analyzeQueries = () => {
  const queryDictionary = {}
  queries.forEach(query => {
    // Store the available contexts if available
    const contexts = []
    query.outputContexts.forEach(context => {
      if (context) {
        contexts.push(context.context)
      }
    })

    // Identify the message text in the query object
    const message = query.messageText.toLowerCase().trim()
    if (queryDictionary[message]) {
      // The same message has been used before
      // Increment the count of that query
      queryDictionary[message].occurrences += 1
      // Add any output contexts
      if (contexts.length > 0) {
        queryDictionary[message].context.push(contexts)
      }
    } else {
      // This is the first time the message has appeared
      // Populate our dictionary with the message and contexts if available
      queryDictionary[message] = {
        occurrences: 1,
        context: contexts,
      }
    }
  })
  const sortableArray = []
  for (const phrase in queryDictionary) {
    sortableArray.push([phrase, queryDictionary[phrase]])
  }

  sortableArray.sort((a, b) => {
    return b[1].occurrences - a[1].occurrences
  })

  // Save full intent data
  fs.writeFile(
    `./dataFiles/fullIntentData.json`,
    JSON.stringify(sortableArray),
    err => {
      if (err) throw err
      console.log('Saved!')
    }
  )

  // Detects entities in the document
  const entitiesCollection = {}

  // Loop through the invididual queries to extract entities
  queries.forEach(async (query, i) => {
    // Minimize number of times we call the API
    if (i < 20) {
      const entities = await getEntities(query)
      if (entities) {
        entities.entitiesArray.forEach(entity => {
          if (entitiesCollection[entity]) {
            // The same message has been used before
            // Increment the count of that query
            entitiesCollection[entity].occurrences += 1
          } else {
            // This is the first time the message has appeared
            // Populate our dictionary with the message and contexts if available
            entitiesCollection[entity] = {
              occurrences: 1,
            }
          }
        })
      }
    }
    const entitiesToSort = []
    for (const phrase in entitiesCollection) {
      entitiesToSort.push([phrase, entitiesCollection[phrase]])
    }

    entitiesToSort.sort((a, b) => {
      return b[1].occurrences - a[1].occurrences
    })
    // Save full intent data
    fs.writeFile(
      `./dataFiles/sortedEntities.json`,
      JSON.stringify(entitiesToSort),
      err => {
        if (err) throw err
        console.log('Saved!')
      }
    )
  })
  return entitiesCollection
}

module.exports = analyzeQueries
