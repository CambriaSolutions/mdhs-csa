const { Suggestion, Card } = require('dialogflow-fulfillment')
const {
  calculatePercentage,
  handleEndConversation,
} = require('./globalFunctions.js')
const { handleEndConversation } = require('./globalFunctions.js')

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
    await agent.context.set({
      name: 'waiting-iwo-no-assistance',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoNoAssistance = async agent => {
  try {
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
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
  } catch (err) {
    console.error(err)
  }
}

exports.iwoIsSupporting = async agent => {
  const isSupporting = agent.parameters.isSupporting.toLowerCase() === 'yes'
  try {
    await agent.add(`Is your employee in arrears greater than 12 weeks?`)
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
  } catch (err) {
    console.error(err)
  }
}

exports.iwoInArrears = async agent => {
  const inArrears = agent.parameters.inArrears.toLowerCase() === 'yes'
  const isSupporting = await agent.context.get('iwo-factors').parameters
    .isSupporting
  const percentage = calculatePercentage(isSupporting, inArrears)
  try {
    await agent.add(
      `Per the Consumer Credit Protection Act, in this case, the employer is responsible to withhold a maximum of ${percentage}% of  the employee's Net Disposable Income. This applies to one IWO or the combination of multiple IWO's.`
    )
    await agent.add(
      `Would you like assistance estimating the withholding amount?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-iwo-confirm-estimate',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-iwo-no-assistance',
      lifespan: 2,
    })

    // Save percentage in context
    await agent.context.set({
      name: 'iwo-factors',
      parameters: { percentage },
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoConfirmEstimate = async agent => {
  try {
    await agent.add(
      `Please note that this is only an estimate. Each case is unique, but I can help get you an estimate. If you need to know the exact amount you need to withhold, please call 1-877-882-4916.`
    )
    await agent.add(new Suggestion('I Understand'))
    await agent.context.set({
      name: 'waiting-iwo-request-disposable-income',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoRequestDisposableIncome = async agent => {
  try {
    await agent.add(`What is the employee's disposable income?`)
    await agent.add(new Suggestion('Disposible Income Definition'))
    await agent.context.set({
      name: 'waiting-iwo-disposable-income',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-iwo-define-disposable-income',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoDefineDisposableIncome = async agent => {
  try {
    await agent.add(
      `Disposable income = gross pay - mandatory deductions such as Federal, state and local taxes, unemployment insurance, workers' compensation insurance, state employee retirement deductions, and other deductions determined by state law. Health insurance premiums may be included in a state's mandatory deductions; they are mandatory deductions for federal employees.`
    )

    await agent.add(
      new Card({
        title: 'Disposable income is not necessarily the same as net pay.',
        text:
          'For more detailed information, click the link to access the U.S. Department of Health and Human Services, Office of Child Support Enforcement website.',
        buttonText: 'Click Here',
        buttonUrl:
          'https://www.acf.hhs.gov/css/resource/processing-an-income-withholding-order-or-notice',
      })
    )
    await agent.add(`What is the employee's disposable income?`)
    await agent.context.set({
      name: 'waiting-iwo-disposable-income',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoDisposableIncome = async agent => {
  const disposableIncome = agent.parameters.disposableIncome
  const percentToWithhold = await agent.context.get('iwo-factors').parameters
    .percentage
  const amountToWithhold = (
    (percentToWithhold / 100) *
    disposableIncome
  ).toFixed(2)
  if (amountToWithhold) {
    try {
      await agent.add(
        `The amount to withhold is approximately $${amountToWithhold}`
      )
      await handleEndConversation(agent)
    } catch (err) {
      console.log(err)
    }
  } else {
    await agent.add(
      `I'm sorry, something went wrong, please try again or contact 1-877-882-4916 for further assistance.`
    )
  }
}

exports.iwoWhereToSubmit = async agent => {
  try {
    await agent.add(
      `The employer is required to submit payments to the State Dispersement Unit per the Income Withholding Order.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoAdministrativeFee = async agent => {
  try {
    await agent.add(
      `Yes, the administrative fee is included in the payment specified on the IWO.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoOtherGarnishments = async agent => {
  try {
    await agent.add(
      `Child Support payments take precedence over all other garnishments.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoOtherState = async agent => {
  try {
    await agent.add(
      `Please contact DHS customer support at 1-877-882-4916 to help with this request.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoInsuranceCoverage = async agent => {
  try {
    await agent.add(
      `If ordered within the IWO, Mississippi CSE only enforces medical insurance payments for children on the IWO.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoNotAnEmployee = async agent => {
  try {
    await agent.add(
      `Per the IWO, the employer is required to respond with employment history to the State Dispersement Unit.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoFireEmployee = async agent => {
  try {
    await agent.add(
      `Per MS state law, if you were to fire an employee due to a garnishment, you are subject to a fine. (Page 4 of IWO - anti discrimination section).`
    )
  } catch (err) {
    console.error(err)
  }
}
