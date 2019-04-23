require('dotenv').config()
const URL = require('url').URL
const fetch = require('node-fetch')
const fs = require('fs')

const locations = [
  '108 S. Whitworth Ave Brookhaven, MS 39601',
  '157 Issaquena Ave Clarksdale, MS 38614',
  '822 N Davis Ave Cleveland, MS 38732',
  '811 Main Street, Suite 18 Columbia, MS 39429',
  '610 S. Cass St Corinth, MS 38834',
  '643 HWY 1, Greenville, MS 38701',
  '1400 Wooded Dr Grenada, MS 38901',
  '14231 Seaway Rd, Suite 5001 Gulfport, MS 39503',
  '5 Willow Bend Hattiesburg, MS 39402',
  '165 W. South St, Suite 100 Hernando, MS 38632',
  '128 W Washington St Kosciusko, MS 39090',
  '1600 Highway 15 N Laurel, MS 39440',
  '110 First Ave SE Magee, MS 39111',
  '907 S. Locust St #C McComb, MS 39648',
  '2911 8th St, Suite A&B Meridian, MS 39301',
  '119 Jefferson Davis Blvd, Suite A Natchez, MS 39120',
  '2550 W Jackson Ave, Suite 2550-6 Oxford, MS 38655',
  '3664 14 St Pascagoula, MS 39567',
  '1122 E Main St, Suite 1 Philadelphia, MS 39328',
  '950 E County Line Road, Suite #G Ridgeland, MS 39157',
  '600 Russell St, Suite 110 Starkville, MS 39759',
  '600 Russell St, Suite 110  Starkville, MS 39759',
  '600 Main St, Suite #B Tupelo, MS 38804',
  '1507 Washington St, 1st Floor Vicksburg, MS 39180',
  '128 W. Jefferson St Yazoo City, MS 39194',
]

const logAddress = async address => {
  const apiKey = process.env.GOOGLE_MAPS_KEY
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json'),
    params = { address: address, key: apiKey }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  const response = await fetch(url)
  const json = await response.json()

  if (json.results.length !== 0) {
    const geoCode = {
      lat: json.results[0].geometry.location.lat,
      lng: json.results[0].geometry.location.lng,
    }
    const placeId = json.results[0].place_id
    const result = {
      address,
      lat: geoCode.lat,
      lng: geoCode.lng,
      placeId: placeId,
    }
    return result
  } else {
    return false
  }
}

let requests = locations.map(location => {
  return logAddress(location)
})

Promise.all(requests).then(responses => {
  console.log(responses)
  fs.writeFile(
    '../functions/coordinates.json',
    JSON.stringify(responses),
    function(err) {
      if (err) throw err
      console.log('Saved!')
    }
  )
})
