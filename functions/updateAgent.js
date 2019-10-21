require('dotenv').config()
const dialogflow = require('dialogflow')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

// // Create a client to export the desired agent using its credential
// const originClient = new dialogflow.v2.AgentsClient({
//   keyFilename: './mdhs-csa-dev-key.json',
// })

// The origin agent name
// const originProjectName = 'mdhs-csa-dev-beta'
// const originParent = originClient.projectPath(originProjectName)

// The storage bucket to export the agent zip
// const storageURI = `gs://mdhs-csa-dev-beta.appspot.com/exports.zip`
// const storageURI = `gs://localtesting-c3466.appspot.com/exports.zip`

// // Export the origin agent to a bucket in the origin's project
// originClient
//   .exportAgent({ parent: originParent, agentUri: storageURI })
//   .then(responses => {
//     const [operation] = responses

//     // Operation#promise starts polling for the completion of the LRO.
//     return operation.promise()
//   })
//   .then(responses => {
//     const result = responses[0]
//     console.log(`originParent: ${originParent} downloaded to ${storageURI}`)
//     const metadata = responses[1]
//     const finalApiResponse = responses[2]

//     // // Create a reference from the storage uri
//     // const gsReference = storage.refFromURL(storageURI)
//     // console.log(gsReference)
//   })
//   .catch(err => {
//     console.error(err)
//   })

// Create a client to receive the exported agent using its credentials
const destinationClient = new dialogflow.v2.AgentsClient({
  keyFilename: './localTestingKey.json',
})
// The agent name to receive the exported agent
const destinationProjectName = 'localTesting'

const destinationParent = destinationClient.projectPath(destinationProjectName)
const agentZip = './mdhs-csa-dev-beta.zip'
console.log(agentZip)
// Restore the destination
destinationClient
  .restoreAgent({ parent: destinationParent, agentContent: agentZip })
  .then(responses => {
    const [operation, initialApiResponse] = responses

    // Operation#promise starts polling for the completion of the LRO.
    return operation.promise()
  })
  .then(responses => {
    const result = responses[0]
    const metadata = responses[1]
    const finalApiResponse = responses[2]
  })
  .catch(err => {
    console.error(err)
  })
