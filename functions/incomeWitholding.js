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
  const isSupporting = await agent.context.get('iwo-factors').parameters
    .isSupporting
  const percentage = calculatePercentage(isSupporting, inArrears)
  try {
    await agent.add(
      `Per the Consumer Credit Protection Act, in this case, the employer is responsible to withhold a maximum of ${percentage}% of  the employee's Net Disposable Income. This applies to one IWO or the combination of multiple IWO's?`
    )
    await agent.add(
      `Would you like assistance estimating the withholding amount?`
    )
    await agent.context.set({
      name: 'waiting-iwo-confirm-estimate',
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

exports.iwoConfirmEstimate = async agent => {
  await agent.add(
    `Please note that this is only an estimate. Each case is unique, but I can help get you an estimate. If you need to know the exact amount you need to withhold, please call 1-877-882-4916.`
  )
  await agent.add(new Suggestion('I Understand'))
  await agent.context.set({
    name: 'waiting-iwo-estimate',
    lifespan: 2,
  })
}

exports.iwoRequestDisposibleIncome = async agent => {
  await agent.add(`What is the employee's disposible income?`)
  await agent.add(new Suggestion('I Understand'))
  await agent.context.set({
    name: 'waiting-iwo-disposible-income',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-iwo-define-disposible-income',
    lifespan: 2,
  })
}

exports.iwoDefineDisposibleIncome = async agent => {
  await agent.add(
    `Disposable income = gross pay - mandatory deductions such as Federal, state and local taxes, unemployment insurance, workers' compensation insurance, state employee retirement deductions, and other deductions determined by state law. Health insurance premiums may be included in a state's mandatory deductions; they are mandatory deductions for federal employees.`
  )
  await agent.add(
    `Note: disposable income is not necessarily the same as net pay. For more detailed information, click here to access the U.S. Department of Health and Human Services, Office of Child Support Enforcement website.`
  )
  await agent.add(`What is the employee's disposible income?`)
  await agent.context.set({
    name: 'waiting-iwo-disposible-income',
    lifespan: 2,
  })
}
