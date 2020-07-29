require('dotenv').config()
const automl = require('@google-cloud/automl')
const fs = require('fs')

// Instantiate autoML client
const client = new automl.v1beta1.PredictionServiceClient()


// Query the category model to return category predictions
const predictCategories = async query => {
  //try {
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

  // Client predictions return all categories sorted by highest classification score (percent confidence),
  // with the highest first. For our purposes, we only return the top three
  const catResponses = await client.predict(catRequest)
  const name1 = catResponses[0].payload[0].displayName
  const confidence1 = catResponses[0].payload[0].classification.score.toFixed(2)
  const name2 = catResponses[0].payload[1].displayName
  const confidence2 = catResponses[0].payload[1].classification.score.toFixed(2)
  const name3 = catResponses[0].payload[2].displayName
  const confidence3 = catResponses[0].payload[2].classification.score.toFixed(2)

  return `${name1},${confidence1},${name2},${confidence2},${name3},${confidence3}`
  // } catch (error) {
  //   console.error(error)
  // }
}

const predictAll = async () => {
  //const predictions1 = await predictCategories('test1')

  fs.readFile('./unhandledQueries 5-4-2020.csv', { encoding: 'utf8' }, async (err, data) => {
    const queries = data.split('\n')
    //console.log(data)
    //console.log(queries)

    let queriesWithCategories = ''
    var index
    for (index = 1; index <= 5600; index++) {
      try {
        const categories = await predictCategories(queries[index])
        queriesWithCategories += queries[index].replace(',', 'COMMAGOESHERE') + ',' + categories + '\n'
      } catch (e) {
        console.error('ERROR!!!!!!', queries[index], index, e)
      }
    }

    console.log(queriesWithCategories)

    const f2 = fs.openSync('./unhandledQueriesCategorized 5-4-2020.csv', 'w')

    const f3 = fs.writeSync(f2, `${queriesWithCategories.toString()}`)

    fs.close(f3, async () => {
      console.log('F3 completed ')
      // Uploads csv file to bucket for AutoML dataset import
    })
  })

  //console.log('Prediction Test 1: ', predictions1)
}

predictAll()