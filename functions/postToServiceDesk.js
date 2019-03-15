const rp = require('request-promise')

exports.sendToServiceDesk = async requestFieldValues => {
  const {
    supportType,
    filteredRequests,
    firstName,
    lastName,
    phoneNumber,
    email,
    caseNumber,
  } = requestFieldValues

  const options = {
    method: 'POST',
    uri: 'https://mdhs-mis-aux.atlassian.net/rest/servicedeskapi/request',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: process.env.SERVICE_DESK_KEY,
    },
    body: {
      serviceDeskId: 7,
      requestTypeId: 54,
      requestFieldValues: {
        summary: supportType,
        description: filteredRequests,
        customfield_10109: { value: 'Test' },
        customfield_10105: 'Child Support',
        customfield_10107: firstName,
        customfield_10108: lastName,
        customfield_10086: phoneNumber,
        customfield_10087: email,
        customfield_10106: caseNumber,
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
