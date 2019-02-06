const { Payload } = require('dialogflow-fulfillment')
const { locations } = require('./geoInfo.js')

exports.mapRoot = async agent => {
  await agent.add(
    new Payload(
      agent.UNSPECIFIED,
      { locations },
      { sendAsMessage: true, rawPayload: true }
    )
  )
  await agent.add(`Here is an interactive map of all of our locations!`)
}
