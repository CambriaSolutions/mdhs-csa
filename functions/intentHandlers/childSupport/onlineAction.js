const { tbd } = require('../globalFunctions')

exports.onlineAction = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}