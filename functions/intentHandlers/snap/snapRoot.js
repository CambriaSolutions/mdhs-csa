const { Suggestion } = require('dialogflow-fulfillment')

exports.snapRoot = async agent => {
  try {
    await agent.add('What can I help you with?')

    await agent.add(new Suggestion('Application'))
    await agent.add(new Suggestion('Doc Upload'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.add(new Suggestion('Eligibility Checker'))
    await agent.add(new Suggestion('SNAP Online Purchasing'))
    await agent.add(new Suggestion('Change Reporting'))

    await agent.context.set({
      name: 'snap-subject-matter',
      lifespan: 999,
    })
  } catch (err) {
    console.error(err)
  }
}