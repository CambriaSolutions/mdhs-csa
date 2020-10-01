const Logger = require('../../utils/Logger')
const logger = new Logger('Other')

exports.other = async agent => {
  try {
    const { tbd } = require('../globalFunctions')

    await tbd(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}