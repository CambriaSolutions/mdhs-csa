
const Logger = require('../../utils/Logger')
const logger = new Logger('Eligibility Checker')

exports.eligibilityChecker = async agent => {
  try {
    const { handleEndConversation } = require('../globalFunctions')

    const link = '<a href="https://www.access.ms.gov/Prescreen/Start" target="_blank">click here</a>'
    await agent.add(
      'Answering a few short questions will let you know if your household might be eligible for benefits. \
      Complete the questions based on your current household information. You will need to be as accurate as \
      possible, however estimates are allowed.'
    )
    await agent.add(`You may ${link} to start the pre-assessment to check the eligibility.`)
    await handleEndConversation(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}