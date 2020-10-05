module.exports = async (req, res) => {
  if (!req.query || !req.query.query) {
    return 'The "query" parameter is required'
  }

  if (!req.query || !req.query.uuid) {
    return 'The "uuid" parameter is required'
  }
  const dialogflowRequest = require('../utils/dialogflowRequest')

  const response = await dialogflowRequest(req, 'event')

  res.json(response)
}
