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
}

const firstName = 'test <Firstname>'
const lastName = 'test <Lastname>'
const caseNumber = 'test <Casenumber>'
const phoneNumber = '9163264446'
const email = 'test <email>'
const supportSummary = 'test summary'
const filteredRequests = 'test Description'

const {
  environment,
  division,
  reporterFirstName,
  reporterLastName,
  reporterPhoneNumber,
  reporterEmail,
  reporterCaseNumber,
  channel,
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
  [channel]: {
    value: 'Chat Bot',
  },
}

console.log(requestFieldBody)

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

console.log(objectToDeliver)
// const sendToServiceDesk = async fieldValues => {
//   if (typeof fieldValues.customfield_10086 !== 'number') {
//     delete fieldValues.customfield_10086
//   }

//   const options = {
//     method: 'POST',
//     uri: process.env.SERVICE_DESK_URI,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: process.env.SERVICE_DESK_KEY,
//     },
//     body: {
//       serviceDeskId: 7,
//       requestTypeId: 54,
//       requestFieldValues: fieldValues,
//     },
//     json: true,
//   }

//   // const serviceRequest = rp(options)
//   //   .then(response => {
//   //     return response
//   //   })
//   //   .catch(err => {
//   //     return err
//   //   })
//   request(options, function(error, response, body) {
//     if (error) throw new Error(error)
//     console.log(
//       'Response: ' + response.statusCode + ' ' + response.statusMessage
//     )
//     console.log(body)
//   })

//   //   return serviceRequest
// }
// sendToServiceDesk(fieldValues)
