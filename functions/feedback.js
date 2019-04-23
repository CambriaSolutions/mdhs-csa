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
    const feedback = JSON.stringify({
      helpful: false,
      options: [
        { value: 'Did not have the information I needed' },
        {
          value: "I wasn't able to have my questions answered",
        },
        {
          value:
            'I would prefer calling in or visiting the office to using Gen',
        },
        {
          value: 'Was not easy conversing with Gen',
        },
        {
          value: 'Was not easy to navigate',
        },
      ],
    })
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
    const feedback = JSON.stringify({
      helpful: true,
      options: [
        { value: 'Had the information I needed' },
        {
          value: 'I was able to answer my question(s)',
          checked: false,
        },
        {
          value: 'Was easy to ask for assistance',
          checked: false,
        },
        {
          value: 'I prefer using Gen to calling or visiting an office',
          checked: false,
        },
        {
          value: 'Was easy to navigate',
          checked: false,
        },
        {
          value: 'Easy to converse with Gen',
          checked: false,
        },
      ],
    })
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
