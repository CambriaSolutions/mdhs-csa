require('dotenv').config()
const rp = require('request-promise')

var options = {
  method: 'GET',
  url: process.env.HEALTH_CHECK_URL,
}

module.exports = async () => {
  try {
    await rp(options)
  } catch (e) {
    console.error(e)
  }
}
