require('dotenv').config()

const admin = require('firebase-admin')
const projectId = admin.instanceId().app.options.projectId

const raiseAlerts = (process.env.RAISE_ALERTS.toLowerCase() === 'true')

const priority = {
  Critical: 'P1',
  High: 'P2',
  Moderate: 'P3',
  Low: 'P4',
  Informational: 'P5',
}

const publishAlert = async (priority, source, message, exception) => {
  if (raiseAlerts) {
    const fetch = require('node-fetch')
    const request = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: process.env.OPSGENIE_API_KEY,
      },
      body: JSON.stringify({
        'message': message,
        'description': `${exception ? exception.stack : 'An error has occurred'}`,
        'priority': priority,
        'alias': `${projectId}::${source}:${message}`.substring(0, 512).trim(),
        'source': projectId
      }),
      json: true,
    }

    const response = await fetch(process.env.OPSGENIE_URI, request)
    if (response.status !== 202) {
      console.error(response.status, response.statusText)
    }
  }
}

const formatMessage = (source, message, exception) => {
  if (exception) {
    return `${source}: ${message}, [${exception.message}]`
  }

  return `${source}: ${message}`
}

exports.Logger = function (source) {
  this.info = (message, exception) => {
    console.log(formatMessage(source, message, exception))
  }
  this.error = (message, exception) => {
    console.error(formatMessage(source, message, exception))
    publishAlert(priority.Moderate, source, message, exception)
      .then(() => { return })
      .catch((err) => { console.error(err) })
  }
  this.fatal = (message, exception) => {
    console.error(formatMessage(source, message, exception))
    publishAlert(priority.Critical, source, message, exception)
      .then(() => { return })
      .catch((err) => { console.error(err) })
  }
}

