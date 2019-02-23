const { Suggestion, Payload } = require('dialogflow-fulfillment')
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
    await agent.add(new Suggestion('718 E Fifteenth St, Yazoo City'))
  } catch (error) {
    console.error(error)
  }
}

exports.mapDeliverMap = async agent => {
  try {
    let userAddress = ''
    let userCity = ''
    let userZip = ''
    if (agent.parameters.userAddress) {
      userAddress = agent.parameters.userAddress.toLowerCase()
    }
    if (agent.parameters.userCity) {
      userCity = agent.parameters.userCity.toLowerCase()
    }
    if (agent.parameters.userZip) {
      userZip = agent.parameters.userZip.toLowerCase()
    }
    let userLocation = `${userAddress} ${userCity} ${userZip}`
    if (!userLocation.includes('ms') && !userLocation.includes('mississippi')) {
      userLocation += 'ms'
    }
    const currentLocation = { userLocation }
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
