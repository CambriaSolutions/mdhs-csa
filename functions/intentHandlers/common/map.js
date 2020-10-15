const { Payload } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('../globalFunctions')
const Logger = require('../../utils/Logger')
const logger = new Logger('Maps')

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
  } catch (err) {
    console.error(err.message, err)
  }
}

const determiningGeocode = async agent => {
  const { getGeocode } = require('./calculateGeo.js')

  const validator = require('validator')

  let currentLocation = null
  let userAddress = ''
  let userCity = ''
  let userZip = ''

  const addressParameter = agent.parameters.userAddress || agent.parameters.address
  if (addressParameter) {
    userAddress = addressParameter.toLowerCase()
  }

  const cityParameter = agent.parameters.userCity || agent.parameters['geo-city']
  if (cityParameter) {
    userCity = cityParameter.toLowerCase()
  }
  // validate zip code before defining it in userZip
  const zipParamter = agent.parameters.userZip || agent.parameters['zip-code']
  if (zipParamter) {
    if (validator.isPostalCode(`${zipParamter}`, 'US')) {
      userZip = zipParamter
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
  return getGeocode(currentLocation)
}

// First pass in the locations to be used in the method. This will return the intent 
// handler function that you would normally use
exports.mapDeliverMap = (locations) => async agent => {
  try {
    const { getNearestThreeLocations } = require('./calculateGeo.js')
    const currentGeocode = await determiningGeocode(agent)

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
    console.error('Unable to query locations', error)
  }
}

exports.mapDeliverMapAndCountyOffice = (locations) => async agent => {
  try {
    const { getNearestThreeLocations } = require('./calculateGeo.js')
    const currentGeocode = await determiningGeocode(agent)

    if (currentGeocode) {
      const countyOfficeContactInformation = require('../common/countyOfficeContactInformation.json')

      const countyInformation = countyOfficeContactInformation[currentGeocode.county]
      const nearestLocations = await getNearestThreeLocations(
        currentGeocode,
        locations
      )
      const mapInfo = { locations, currentGeocode, nearestLocations }
      const mapPayload = JSON.stringify(mapInfo)
      if (countyInformation) {
        await agent.add(`${currentGeocode.county.toUpperCase()} COUNTY \u003cbr\u003e - Phone Number: <a href="tel:+${countyInformation.phone.replace('.', '').replace('.', '')}">${countyInformation.phone}</a> \u003cbr\u003e - Email Address: <a href="mailto:${countyInformation.email}">${countyInformation.email}</a> \u003cbr\u003e - Fax Number: ${countyInformation.fax}`)
      }
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
        name: 'waiting-maps-deliver-map-county-office',
        lifespan: 1,
      })
    }
  } catch (error) {
    console.error('Unable to query locations and county', error)
  }
}