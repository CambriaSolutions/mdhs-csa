const { Suggestion } = require('dialogflow-fulfillment')

exports.snapRoot = async agent => {
  const spanishGuideLink = 'https://www.mdhs.ms.gov/wp-content/uploads/2020/08/12377.7363_TARGET-Spanish_SNAP-facts-for-language-1.pdf'
  const vietnameseGuideLink = 'https://www.mdhs.ms.gov/wp-content/uploads/2020/08/12377.7363_TARGET-Vietnamese_SNAP-facts-for-language-1.pdf'

  try {
    await agent.add('What can I help you with?')
    await agent.add(`Para espanol, <a href="${spanishGuideLink}" target="_blank">presione aqui.</a>`)
    await agent.add(`Bằng tiếng việt, <a href="${vietnameseGuideLink}" target="_blank">nhấn vào đây.</a>`)

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