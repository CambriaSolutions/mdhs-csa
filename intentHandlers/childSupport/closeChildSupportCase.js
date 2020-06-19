const { supportType } = require('./support.js')

exports.closeCSCQACloseCase = async agent => {
  try {
    await supportType(agent, 'request case closure')
  } catch (err) {
    console.error(err)
  }
}