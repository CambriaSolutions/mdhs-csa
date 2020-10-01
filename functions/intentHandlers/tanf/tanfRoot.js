const Logger = require('../../utils/Logger')
const logger = new Logger('TANF Root')
const { Suggestion } = require('dialogflow-fulfillment')

exports.tanfRoot = async agent => {
  try {
    await agent.add('What can I help you with?')

    await agent.add(new Suggestion('Application'))
    await agent.add(new Suggestion('Doc Upload'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.add(new Suggestion('Eligibility Checker'))
    await agent.add(new Suggestion('Change Reporting'))

    await agent.context.set({
      name: 'tanf-subject-matter',
      lifespan: 999,
    })
  } catch (err) {
    logger.error(err.message, err)
  }
}