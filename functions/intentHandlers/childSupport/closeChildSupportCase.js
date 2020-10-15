exports.closeCSCQACloseCase = async agent => {
  const { supportType } = require('./support.js')

  try {
    await supportType(agent, 'request case closure')
  } catch (err) {
    console.error(err.message, err)
  }
}