const Logger = require('../../utils/Logger')
const logger = new Logger('Close Child Support Case')

exports.closeCSCQACloseCase = async agent => {
  const { supportType } = require('./support.js')

  try {
    await supportType(agent, 'request case closure')
  } catch (err) {
    logger.error(err.message, err)
  }
}