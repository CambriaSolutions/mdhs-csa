require('dotenv').config()
const rp = require('request-promise')
const request = require('request')

const serviceDeskFields = {
  environment: 'customfield_10109',
  division: 'customfield_10105',
  reporterFirstName: 'customfield_10107',
  reporterLastName: 'customfield_10108',
  reporterPhoneNumber: 'customfield_10086',
  reporterEmail: 'customfield_10087',
  reporterCaseNumber: 'customfield_10106',
  channel: 'customfield_10084',
  companyName: 'customfield_10111',
}

const firstName = 'test <Firstname>'
const lastName = 'test <Lastname>'
const caseNumber = 'test <Casenumber>'
const phoneNumber = '9163264446'
const email = 'test <email>'
const supportSummary = 'test summary'
const filteredRequests = 'test Description'
const company = ''

const {
  environment,
  division,
  reporterFirstName,
  reporterLastName,
  reporterPhoneNumber,
  reporterEmail,
  reporterCaseNumber,
  channel,
  companyName,
} = serviceDeskFields

const requestFieldBody = {
  summary: supportSummary,
  description: filteredRequests,
  [environment]: { value: 'Test' },
  [division]: 'Child Support',
  [reporterFirstName]: firstName,
  [reporterLastName]: lastName,
  [reporterPhoneNumber]: phoneNumber,
  [reporterEmail]: email,
  [reporterCaseNumber]: caseNumber,
  [companyName]: company,
  [channel]: {
    value: 'Chat Bot',
  },
}

let objectToDeliver
if (typeof phoneNumber !== 'number') {
  objectToDeliver = Object.keys(requestFieldBody).reduce((object, key) => {
    if (key !== reporterPhoneNumber) {
      object[key] = requestFieldBody[key]
    }
    return object
  }, {})
} else {
  objectToDeliver = requestFieldBody
}

const sendToServiceDesk = async fieldValues => {
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
      requestFieldValues: fieldValues,
    },
    json: true,
  }

  request(options, function(error, response, body) {
    if (error) throw new Error(error)
    console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
    )
    console.log(body)
  })
}
sendToServiceDesk(objectToDeliver)
