const { Payload } = require('dialogflow-fulfillment')

// Send a payload to disable user input and require suggestion selection
exports.disableInput = async agent => {
  try {
    await agent.add(
      new Payload(
        agent.UNSPECIFIED,
        { disableInput: 'true' },
        {
          sendAsMessage: true,
          rawPayload: true,
        }
      )
    )
  } catch (err) {
    console.error(err)
  }
}