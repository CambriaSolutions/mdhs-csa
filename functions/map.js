const { Payload } = require('dialogflow-fulfillment')
const { locations } = require('./geoInfo.js')

exports.mapRoot = async agent => {
  const mapPayload = {
    type: 'map',
    locations,
  }
  await agent.add(
    new Payload(
      agent.UNSPECIFIED,
      { mapPayload },
      { sendAsMessage: true, rawPayload: true }
    )
  )
  await agent.add(`Here is an interactive map of all of our locations!`)
}
