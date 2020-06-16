const { tbd } = require('../globalFunctions')

exports.fee = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}