const { tbd } = require('../globalFunctions')

exports.paymentTimelines = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}