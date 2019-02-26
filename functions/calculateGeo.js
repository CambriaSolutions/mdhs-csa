require('dotenv').config()
const URL = require('url').URL
const fetch = require('node-fetch')
const geolib = require('geolib')

exports.getGeocode = async address => {
  const apiKey = process.env.GOOGLE_MAPS_KEY
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json'),
    params = {
      address: address.userLocation,
      key: apiKey,
    }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  const response = await fetch(url)
  const json = await response.json()
  if (json.results.length !== 0) {
    const geoCode = {
      lat: json.results[0].geometry.location.lat,
      lng: json.results[0].geometry.location.lng,
    }
    return geoCode
  }
}

exports.getNearestThreeLocations = (currentCoordinates, locations) => {
  if (currentCoordinates !== null) {
    const results = locations.map(function(place) {
      const distance = geolib.getDistance(
        { lat: currentCoordinates.lat, lng: currentCoordinates.lng },
        {
          lat: place.lat,
          lng: place.lng,
        }
      )
      const distanceMiles = geolib.convertUnit('mi', distance, 2)
      return {
        lat: place.lat,
        lng: place.lng,
        street: place.addressComponents['street'],
        city: place.addressComponents['city'],
        placeId: place.placeId,
        distance: distanceMiles,
      }
    })
    const sortedResults = results.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    )
    const getNearestThreeLocations = sortedResults.slice(0, 3)

    return getNearestThreeLocations
  }
}
