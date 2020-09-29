exports.terminateRoot = async agent => {
  try {
    const { Suggestion } = require('dialogflow-fulfillment')

    await agent.add(
      'Child support generally terminates when a child emancipates. However, if you are asking about case closure, MDHS must adhere to federal guidelines when closing cases. These guidelines provide MDHS with several options to close a case. If you would like more information about emancipation or if you would like to submit a request to discuss case closure, please select an option below.'
    )
    await agent.add(new Suggestion('Emancipation'))
    await agent.add(new Suggestion('Request Case Closure'))
  } catch (err) {
    console.error(err)
  }
}