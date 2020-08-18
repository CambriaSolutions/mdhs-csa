const { Payload } = require('dialogflow-fulfillment')
const validator = require('validator')
const { getGeocode, getNearestThreeLocations } = require('./calculateGeo.js')
const { handleEndConversation } = require('../globalFunctions')

exports.mapRoot = (subjectMatter) => async agent => {
  try {
    if (subjectMatter === 'wfd') {
      await agent.add('You may contact a MDHS county office between 8:00 am and 5:00 pm, Monday through Friday, excluding holidays, to obtain additional information about S2W.')
    } else {
      await agent.add('You may visit any office between 8:00 am and 5:00 pm, Monday through Friday, excluding holidays, to obtain information about your case.')
    }

    if (subjectMatter !== 'cse') {
      await agent.add('Due to COVID-19, all our county offices are closed to the public until further notice.')
    }

    await agent.add(
      'I can help locate the nearest office to you, what is your address?'
    )
    await agent.context.set({
      name: 'waiting-maps-deliver-map',
      lifespan: 2,
    })
  } catch (error) {
    console.error(error)
  }
}

// First pass in the locations to be used in the method. This will return the intent 
// handler function that you would normally use
exports.mapDeliverMap = (locations) => async agent => {
  try {
    let currentLocation = null
    let userAddress = ''
    let userCity = ''
    let userZip = ''

    if (agent.parameters.userAddress) {
      userAddress = agent.parameters.userAddress.toLowerCase()
    }
    if (agent.parameters.userCity) {
      userCity = agent.parameters.userCity.toLowerCase()
    }
    // validate zip code before defining it in userZip
    if (agent.parameters.userZip) {
      if (validator.isPostalCode(`${agent.parameters.userZip}`, 'US')) {
        userZip = agent.parameters.userZip
      }
    }
    // build current location string
    if (userZip !== '' || userCity !== '' || userAddress !== '') {
      currentLocation = `${userAddress} ${userCity} ${userZip}`

      if (
        !currentLocation.includes(' ms') ||
        !currentLocation.includes(' mississippi')
      ) {
        currentLocation += ' ms'
      }
    }
    // retrieve long and lat coordinates from current location
    const currentGeocode = await getGeocode(currentLocation)

    if (currentGeocode) {
      const nearestLocations = await getNearestThreeLocations(
        currentGeocode,
        locations
      )
      const mapInfo = { locations, currentGeocode, nearestLocations }
      const mapPayload = JSON.stringify(mapInfo)
      await agent.add('Here is an interactive map of all of our locations!')
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
      await handleEndConversation(agent)
    } else {
      await agent.add(
        'Sorry, I couldn\'t find that address. Could you say that again?'
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
