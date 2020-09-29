const startCSCConvo = async agent => {
  try {
    const { Suggestion } = require('dialogflow-fulfillment')

    await agent.add(
      'Sure, I can help you with finding the type of service you desire. I can also help you with information, instructions and a link to the application to open a child support case.'
    )
    await agent.add(
      'The custodial parent, non-custodial parent or guardian may complete an application.'
    )
    await agent.add(
      'Which of the following services do you want assistance with?'
    )

    await agent.add(new Suggestion('Full Services'))
    await agent.add(new Suggestion('Location Services'))
    await agent.add(new Suggestion('Safety'))
    await agent.add(new Suggestion('Income Disbursement Service Only'))

    await agent.context.set({
      name: 'waiting-open-csc-full-services',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-open-csc-location-services',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-open-csc-employer-payments',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCRoot = async agent => {
  await startCSCConvo(agent)
}

exports.openCSCSelectForm = async agent => {
  try {
    const { handleEndConversation } = require('../globalFunctions')

    await agent.add(
      'Click <a href="http://www.mdhs.ms.gov/wp-content/uploads/2018/11/CSE_675-Application-11-2-18.pdf" target="_blank">here</a> to access the Child Support Service Application form. The form will open in a web browser and you can print it off from there.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCNoService = async agent => {
  try {
    await startCSCConvo(agent)
  } catch (err) {
    console.error(err)
  }
}
