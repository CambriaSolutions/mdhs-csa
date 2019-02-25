const { Suggestion } = require('dialogflow-fulfillment')
const { calculatePercentage } = require('./globalFunctions.js')

exports.iwoRoot = async agent => {
  try {
    await agent.add(
      `As the employer, you are obligated to withhold per the Consumer Credit Protection Act guidelines.`
    )
    await agent.add(
      `Would you like assistance working through the CCPA guidelines to determine how much to withhold?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-iwo-wants-assistance',
      lifespan: 2,
    })
  } catch (error) {
    console.error(error)
  }
}

exports.iwoWantsAssistance = async agent => {
  try {
    await agent.add(
      `Is your employee supporting another family other than the one in the IWO?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-iwo-is-supporting',
      lifespan: 2,
    })
  } catch (error) {
    console.error(error)
  }
}

exports.iwoIsSupporting = async agent => {
  const isSupporting = agent.parameters.isSupporting.toLowerCase() === 'yes'
  try {
    await agent.add(
      `Is your employee supporting another family other than the one in the IWO?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-iwo-in-arrears',
      lifespan: 2,
    })
    // Save isSupporting in context
    await agent.context.set({
      name: 'iwo-factors',
      parameters: { isSupporting },
      lifespan: 100,
    })
  } catch (error) {
    console.error(error)
  }
}

exports.iwoInArrears = async agent => {
  const inArrears = agent.parameters.inArrears.toLowerCase() === 'yes'
  const isSupporting = agent.context.get('iwo-factors').isSupporting
  const percentage = calculatePercentage(isSupporting, inArrears)
  try {
    await agent.add(
      `Per the Consumer Credit Protection Act, in this case, the employer is responsible to withhold a maximum of ${percentage}% of  the employee's Net Disposable Income. This applies to one IWO or the combination of multiple IWO's?`
    )
    await agent.add(
      `Would you like assistance estimating the withholding amount?`
    )
    await agent.context.set({
      name: 'waiting-iwo-estimate',
      lifespan: 2,
    })

    // Save percentage in context
    await agent.context.set({
      name: 'iwo-factors',
      parameters: { percentage },
    })
  } catch (error) {
    console.error(error)
  }
}

exports.iwoCalculateArrears = async agent => {
  const isSupporting = agent.parameters.isSupporting.toLowerCase() === 'yes'
  const inArrears = agent.parameters.inArrears.toLowerCase() === 'yes'
  const percentage = calculateArrears(isSupporting, inArrears)
  if (percentage) {
    try {
      await agent.add(
        `Per the Consumer Credit Protection Act, in this case, the employer is responsible to withhold a maximum of ${percentage}% of  the employee's Net Disposable Income. This applies to one IWO or the combination of multiple IWO's?`
      )
      await agent.add(
        `Would you like assistance estimating the withholding amount?`
      )
      await agent.context.set({
        name: 'waiting-iwo-estimate',
        lifespan: 2,
      })
    } catch (error) {
      console.error(error)
    }
  } else {
    await agent.add(
      `Sorry, something went wrong. Please call 1-877-882-4916 to receive further support.`
    )
  }
}
