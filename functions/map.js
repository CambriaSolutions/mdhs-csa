const { Payload } = require('dialogflow-fulfillment')
const locations = require('./coordinates.js')

exports.mapRoot = async agent => {
  const mapPayload = JSON.stringify(locations)
  await agent.add(`Here is an interactive map of all of our locations!`)
  await agent.add(
    new Payload(
      agent.UNSPECIFIED,
      { mapPayload },
      {
        sendAsMessage: true,
        rawPayload: true,
      }
    )
  )
}
