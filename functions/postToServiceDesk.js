const rp = require('request-promise')

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
  employer: 'customfield_10136',
  employerPhoneNumber: 'customfield_10137',
  employmentSubType: 'customfield_10138',
}

// Cases requiring a callback
const callbackRequired = [
  'request case closure',
  'add authorized user',
  'employer report lump sum notification',
  'change personal information',
]

exports.sendToServiceDesk = async requestFieldValues => {
  const {
    supportSummary,
    filteredRequests,
    firstName,
    lastName,
    phoneNumber,
    email,
    caseNumber,
    company,
    newEmployerName,
    newEmployerNumber,
    employmentChangeType,
  } = requestFieldValues

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
    employer,
    employerPhoneNumber,
    employmentSubType,
  } = serviceDeskFields

  // Check to see if the support request requires a callback
  const callBackCommitment = callbackRequired.includes[
    supportSummary.toLocaleLowerCase()
  ]
    ? 'Call back'
    : 'None'

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
    [employer]: newEmployerName,
    [employerPhoneNumber]: newEmployerNumber,
    [employmentSubType]: employmentChangeType,
  }

  // Will replace after type of string accepted
  let requestObjectToDeliver
  if (isNaN(phoneNumber)) {
    requestObjectToDeliver = Object.keys(requestFieldBody).reduce(
      (object, key) => {
        if (key !== reporterPhoneNumber) {
          object[key] = requestFieldBody[key]
        }
        return object
      },
      {}
    )
  } else {
    requestObjectToDeliver = requestFieldBody
  }

  const options = {
    method: 'POST',
    uri: process.env.SERVICE_DESK_URI,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: process.env.SERVICE_DESK_KEY,
    },
    body: {
      serviceDeskId: process.env.SERVICE_DESK_ID,
      requestTypeId: process.env.REQUEST_TYPE_ID,
      requestFieldValues: requestObjectToDeliver,
    },
    json: true,
  }

  const serviceRequest = rp(options)
    .then(response => {
      return response
    })
    .catch(err => {
      console.log(requestObjectToDeliver)
      console.error(err)
      return err
    })

  return serviceRequest
}
