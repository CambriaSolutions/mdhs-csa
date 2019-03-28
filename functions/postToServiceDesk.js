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
}

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

  let requestObjecToDeliver
  if (typeof phoneNumber !== 'number') {
    requestObjecToDeliver = Object.keys(requestFieldBody).reduce(
      (object, key) => {
        if (key !== reporterPhoneNumber) {
          object[key] = requestFieldBody[key]
        }
        return object
      },
      {}
    )
  } else {
    requestObjecToDeliver = requestFieldBody
  }
  console.log(requestObjecToDeliver)
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
      requestFieldValues: requestObjecToDeliver,
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
