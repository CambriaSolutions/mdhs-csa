require('dotenv').config()
const request = require('request')

const options = {
  method: 'POST',
  url: 'https://mdhs-mis-aux.atlassian.net/rest/servicedeskapi/request',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: process.env.SERVICE_DESK_KEY,
  },
  body: JSON.stringify({
    serviceDeskId: 7,
    requestTypeId: 54,
    requestFieldValues: {
      summary: 'test summary',
      description: 'test Description',
      customfield_10105: 'test Division',
      customfield_10085: 'test <Firstname>',
      customfield_10088: 'test <Lastname>',
      customfield_10086: 9163264446,
      customfield_10087: 'test <email>',
      customfield_10106: 'test <Casenumber>',
      customfield_10084: {
        value: 'test <chatbot>',
      },
      customfield_10109: '<Environment>',
    },
  }),
}

request(options, function(error, response, body) {
  if (error) throw new Error(error)
  console.log('Response: ' + response.statusCode + ' ' + response.statusMessage)
  console.log(body)
})
