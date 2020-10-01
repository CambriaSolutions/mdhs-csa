const Logger = require('../../utils/Logger')
const logger = new Logger('Contact QA')

exports.contactSupportHandoff = async agent => {
  const { supportRoot } = require('./support.js')

  try {
    await supportRoot(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}