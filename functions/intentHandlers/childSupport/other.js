const { tbd } = require('../globalFunctions')

exports.other = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}