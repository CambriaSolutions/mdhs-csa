const { tbd } = require('../globalFunctions')

exports.fax = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}