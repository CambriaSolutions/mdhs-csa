const { tbd } = require('../globalFunctions')

exports.legal = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}