const Logger = require('../../utils/Logger')
const logger = new Logger('Fax')

exports.fax = async agent => {
  const { tbd } = require('../globalFunctions')

  try {
    await tbd(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}