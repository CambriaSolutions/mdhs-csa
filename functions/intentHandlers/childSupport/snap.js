const { tbd } = require('../globalFunctions')

exports.snap = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}