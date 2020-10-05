exports.contactSupportHandoff = async agent => {
  const { supportRoot } = require('./support.js')

  try {
    await supportRoot(agent)
  } catch (error) {
    console.error(error)
  }
}