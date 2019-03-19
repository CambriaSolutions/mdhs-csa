require('dotenv').config()
const rp = require('request-promise')

const sendToServiceDesk = async => {
  const options = {
    method: 'POST',
    uri: process.env.SERVICE_DESK_URI,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: process.env.SERVICE_DESK_KEY,
    },
    body: {
      serviceDeskId: 7,
      requestTypeId: 54,
      requestFieldValues: {
        summary: 'test summary',
        description: 'test Description',
        customfield_10109: { value: 'Test' },
        customfield_10105: 'test Division',
        customfield_10107: 'test <Firstname>',
        customfield_10108: 'test <Lastname>',
        customfield_10086: 9163264446,
        customfield_10087: 'test <email>',
        customfield_10106: 'test <Casenumber>',
        customfield_10084: {
          value: 'Chat Bot',
        },
      },
    },
    json: true,
  }

  const serviceRequest = rp(options)
    .then(response => {
      return response
    })
    .catch(err => {
      return err
    })

  return serviceRequest
}
