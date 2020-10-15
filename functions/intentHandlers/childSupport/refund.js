const Logger = require('../../utils/Logger')
const logger = new Logger('Refund')

exports.refund = async agent => {
  try {
    const { tbd } = require('../globalFunctions')

    await tbd(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}