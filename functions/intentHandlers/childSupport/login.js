const { tbd } = require('../globalFunctions')

exports.login = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}