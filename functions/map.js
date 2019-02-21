const { Payload } = require('dialogflow-fulfillment')
const { locations } = require('./geoInfo.js')

exports.mapRoot = async agent => {
  try {
    await agent.add(
      `I can help located the nearest child support office to you, what is your address?`
    )
    await agent.context.set({
      name: 'waiting-maps-deliver-map',
      lifespan: 2,
    })
  } catch (error) {
    console.error(error)
  }
}

exports.mapDeliverMap = async agent => {
  try {
    const userAddress = agent.parameters.userAddress
    const userCity = agent.parameters.userCity
    const currentLocation = { userAddress, userCity }
    const mapInfo = [currentLocation, locations]
    const mapPayload = JSON.stringify(mapInfo)
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
  } catch (error) {
    console.error(error)
  }
}
