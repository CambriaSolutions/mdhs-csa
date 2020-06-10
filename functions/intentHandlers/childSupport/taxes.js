const { tbd } = require('../globalFunctions')

exports.taxes = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}