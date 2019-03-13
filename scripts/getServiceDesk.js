require('dotenv').config()
var request = require('request')

var options = {
  method: 'GET',
  url: 'https://mdhs-mis-aux.atlassian.net/rest/servicedeskapi/request',
  headers: {
    Accept: 'application/json',
    Authorization: process.env.SERVICE_DESK_KEY,
  },
}

request(options, function(error, response, body) {
  if (error) throw new Error(error)
  console.log('Response: ' + response.statusCode + ' ' + response.statusMessage)
  console.log(body)
})
