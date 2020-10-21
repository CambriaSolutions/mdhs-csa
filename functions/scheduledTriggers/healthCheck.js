require('dotenv').config()

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
