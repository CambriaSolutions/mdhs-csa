exports.verification = async agent => {
  const { Suggestion } = require('dialogflow-fulfillment')

  const verificationFormLink = 'https://www.mdhs.ms.gov/wp-content/uploads/2020/06/Form-617-Verification-of-Services.pdf'

  try {
    await agent.add(`If you need to verify that you are cooperating with child support, please <a href="${verificationFormLink}" target="_blank">click here</a> to access the verification of services form and submit the form to mscsecallcenter@mdhs.ms.gov or you may submit a support request below for more assistance.`)
    await agent.add('If you need a statement of accounting to show your balance, please submit the “request payment history” option below.')

    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Request Payment History'))
    await agent.add(new Suggestion('Cooperation'))
    await agent.add(new Suggestion('Submit Feedback'))

    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-verification',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-feedback-root',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}