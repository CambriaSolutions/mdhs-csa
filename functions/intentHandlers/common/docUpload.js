
const Logger = require('../../utils/Logger')
const logger = new Logger('Doc Upload')

exports.docUpload = async agent => {
  try {
    const { handleEndConversation } = require('../globalFunctions')

    const link = '<a href="https://ea-upload.mdhs.ms.gov/" target="_blank">click here</a>'

    await agent.add('You have the option to upload documentation for your SNAP and TANF cases.')

    await agent.add(`Please ${link} to upload documents for your case.`)
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}