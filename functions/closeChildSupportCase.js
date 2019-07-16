const { supportRequestCaseClosure } = require('./support.js')

exports.closeCSCQACloseCase = async agent => {
  try {
    await supportRequestCaseClosure(agent)
  } catch (err) {
    console.error(err)
  }
}
