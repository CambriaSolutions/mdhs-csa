require('dotenv').config()

const Logger = require('../utils/Logger')
const logger = new Logger('Health Check')

var options = {
  method: 'GET',
  url: process.env.HEALTH_CHECK_URL,
}

module.exports = async () => {
  const rp = require('request-promise')

  try {
    await rp(options)
  } catch (err) {
    console.error(err.message, err)
  }
}
