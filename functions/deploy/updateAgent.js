require('dotenv').config()
const { format } = require('date-fns')
const dialogflow = require('dialogflow')

const client = new dialogflow.v2.AgentsClient({
  credentials: {
    client_email: process.env.DEV_BETA_CLIENT_EMAIL,
    private_key: process.env.DEV_BETA_PRIVATE_KEY,
  },
})

const currentDay = format(new Date(), 'MM-dd')
const storageUri = `gs://${process.env.DEV_BETA_PROJECT_ID}.appspot.com/exports/${process.env.DEV_BETA_PROJECT_ID}_${currentDay}.zip`
const formattedParent = client.projectPath(process.env.DEV_BETA_PROJECT_ID)
// Handle the operation using the promise pattern.
console.time('start')
client
  .exportAgent({
    parent: formattedParent,
    agentUri: storageUri,
  })
  .then(responses => {
    console.log('passed first')
    const [operation] = responses
    return operation.promise()
  })
  .then(() => {
    // Create a new client for DF
    const newClient = new dialogflow.v2.AgentsClient({
      credentials: {
        client_email: process.env.DEV_CLIENT_EMAIL,
        private_key: process.env.DEV_PRIVATE_KEY,
      },
    })
    console.log(newClient)
    const destinationParent = newClient.projectPath(process.env.DEV_PROJECT_ID)
    // newClient
    //   .importAgent({
    //     parent: destinationParent,
    //     agentUri: storageUri,
    //   })
    //   .then(responses => {
    //     console.log('passed second')
    //     const [operation] = responses
    //     return operation.promise()
    //   })
    //   .then(responses => {
    //     console.timeEnd('start')
    //     console.log(responses)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  })
  .catch(err => {
    console.error(err)
  })
