const { tbd } = require('../globalFunctions')

exports.documentation = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}