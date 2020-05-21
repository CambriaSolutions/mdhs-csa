const { Suggestion } = require('dialogflow-fulfillment')

exports.calcRoot = async agent => {
  try {
    await agent.add(
      'I offer two different calculators. The “Estimate Payments” calculator helps <strong>estimate</strong> child support payments on a single case involving one biological family. The “CCPA Calculator” provides an <strong>estimate</strong> to parents or employers regarding the maximum amount an employer may withhold pursuant to the federal Consumer Credit Protection Act.'
    )
    await agent.add(
      'You may select an option below to calculate an <strong>estimate</strong> based on your information. If you are a parent who is or will be receiving payments, you may select "Payments".'
    )
    await agent.add(new Suggestion('CCPA Calculator'))    
    await agent.add(new Suggestion('Estimate Payments'))
    await agent.add(new Suggestion('Payments'))

    await agent.context.set({
      name: 'waiting-payment-calc',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}