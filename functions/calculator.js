const { Suggestion } = require('dialogflow-fulfillment')

exports.calcRoot = async agent => {
  try {
    await agent.add(
      'This estimator can help you determine payments based on a single case involving a single biological family. While each case is unique, I can help get you an estimate.'
    )
    await agent.add(
      'Select one of the options below if you want assistance estimating employee witholding or how to receieve or make child support payments.'
    )
    await agent.add(new Suggestion('CCPA Calculator'))
    await agent.add(new Suggestion('Child Support Payments'))
  } catch (err) {
    console.error(err)
  }
}