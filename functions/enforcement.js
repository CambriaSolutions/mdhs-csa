const { Suggestion } = require('dialogflow-fulfillment')
const { supportInquiries } = require('./support.js')

exports.enforcementRoot = async agent => {
  try {
    await agent.add(
      `I’m not an expert in enforcement actions yet, but enforcement remedies include: garnishment of wages, suspension of licenses, and many others. You can find more information <a href="https://www.mdhs.ms.gov/child-support/" target="_blank">here</a>.  If you would like to submit a support request to learn more about enforcement of your case, please click below.`
    )
    await agent.add(new Suggestion('Submit Inquiry'))
    await agent.add(new Suggestion('Home'))
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.enforcementSubmitInquiry = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err)
  }
}
