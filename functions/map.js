const { Payload } = require('dialogflow-fulfillment')
const validator = require('validator')
const { getGeocode, getNearestThreeLocations } = require('./calculateGeo.js')
const locations = require('./coordinates.json')

exports.mapRoot = async agent => {
  try {
    await agent.add(
      `I can help locate the nearest Child Support office to you, what is your address?`
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
      console.log(validator.isPostalCode(`${userZip}`, 'US'))
      if (validator.isPostalCode(`${agent.parameters.userZip}`, 'US')) {
        userZip = agent.parameters.userZip
      } else {
        userZip = ''
      }
    }
    if (userZip !== '' || userCity !== '' || userAddress !== '') {
      let userLocation = `${userAddress} ${userCity} ${userZip}`

      if (
        !userLocation.includes(' ms') ||
        !userLocation.includes(' mississippi')
      ) {
        userLocation += ' ms'
      }

      const currentLocation = { userLocation }
      const currentGeocode = await getGeocode(currentLocation)
      const nearestLocations = getNearestThreeLocations(
        currentGeocode,
        locations
      )
      const mapInfo = { locations, currentGeocode, nearestLocations }
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
    } else {
      await agent.add(
        `Sorry, I couldn't find that address. Could you say that again?`
      )
      await agent.context.set({
        name: 'waiting-maps-deliver-map',
        lifespan: 2,
      })
    }
  } catch (error) {
    console.error(error)
  }
}
