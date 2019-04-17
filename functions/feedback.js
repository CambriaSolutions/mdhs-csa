const { Payload } = require('dialogflow-fulfillment')

exports.feedbackRoot = async agent => {
  try {
    await agent.add(`Was Gen helpful?`)
    await agent.context.set({
      name: 'waiting-feedback-not-helpful',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-feedback-helpful',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.feedbackNotHelpful = async agent => {
  try {
    const feedback = JSON.stringify({ helpful: false })
    await agent.add(`Why was Gen not helpful?`)
    await agent.add(
      new Payload(
        agent.UNSPECIFIED,
        { feedback },
        {
          sendAsMessage: true,
          rawPayload: true,
        }
      )
    )
    await agent.context.set({
      name: 'waiting-feedback-complete',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.feedbackHelpful = async agent => {
  try {
    const feedback = JSON.stringify({ helpful: true })

    await agent.add(`Why was Gen helpful?`)
    await agent.add(
      new Payload(
        agent.UNSPECIFIED,
        { feedback },
        {
          sendAsMessage: true,
          rawPayload: true,
        }
      )
    )
    await agent.context.set({
      name: 'waiting-feedback-complete',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.feedbackComplete = async agent => {
  try {
    await agent.add(`To start over just say hello!`)
  } catch (err) {
    console.log(err)
  }
}
