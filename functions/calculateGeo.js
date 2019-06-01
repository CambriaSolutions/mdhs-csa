require('dotenv').config()
const URL = require('url').URL
const fetch = require('node-fetch')
const mapsKey = process.env.GOOGLE_MAPS_KEY

exports.getGeocode = async address => {
  if (!address) {
    return
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json'),
    params = {
      address,
      key: mapsKey,
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

exports.getNearestThreeLocations = async (currentCoordinates, locations) => {
  if (currentCoordinates !== null) {
    const results = await Promise.all(
      locations.map(async function(place) {
        const url = new URL(
            'https://maps.googleapis.com/maps/api/distancematrix/json'
          ),
          params = {
            units: 'imperial',
            origins: `${currentCoordinates.lat},${currentCoordinates.lng}`,
            destinations: `${place.lat},${place.lng}`,
            key: mapsKey,
          }
        Object.keys(params).forEach(key =>
          url.searchParams.append(key, params[key])
        )

        const response = await fetch(url)
        const json = await response.json()

        if (json.rows.length !== 0) {
          const distance = json.rows[0].elements[0].distance.text
          return {
            lat: place.lat,
            lng: place.lng,
            street: place.addressComponents.street,
            city: place.addressComponents.city,
            placeId: place.placeId,
            distance,
          }
        }
      })
    )
    const sortedResults = results.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    )
    const nearestThreeLocations = sortedResults.slice(0, 3)
    return nearestThreeLocations
  }
}
