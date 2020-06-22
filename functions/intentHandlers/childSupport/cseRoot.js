const { Suggestion } = require('dialogflow-fulfillment')

exports.cseRoot = async agent => {
  try {
    await agent.add('What can I help you with?')

    await agent.add(new Suggestion('Common Requests'))
    await agent.add(new Suggestion('Appointments'))
    await agent.add(new Suggestion('Payments'))
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('Opening a Child Support Case'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.add(new Suggestion('Policy Manual'))
    await agent.add(new Suggestion('Enforcement Action'))

    // TODO do we really want to comment these out???? Not in lucid charts
    // await agent.add(new Suggestion('Stimulus Check'))
    // await agent.add(new Suggestion('Cooperation'))
    // await agent.add(new Suggestion('Visitation'))
    // await agent.add(new Suggestion('Submit Support Request'))
    // await agent.add(new Suggestion('Parent\'s Guide to CSE'))

    await agent.context.set({
      name: 'cse-subject-matter',
      lifespan: 999,
    })
  } catch (err) {
    console.error(err)
  }
}