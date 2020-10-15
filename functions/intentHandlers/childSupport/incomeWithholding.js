const Logger = require('../../utils/Logger')
const logger = new Logger('Income Witholding')

const { Suggestion } = require('dialogflow-fulfillment')
const {
  calculatePercentage,
  handleEndConversation,
  formatCurrency,
  disableInput,
} = require('../globalFunctions')

exports.iwoConfirmEstimate = async agent => {
  try {
    await agent.add(
      'Please note that this is only an estimate. Each case is unique, but I can help get you an estimate. If you need to know the exact amount you need to withhold, please call <a href="tel:+18778824916">1-877-882-4916</a>.'
    )
    await agent.add(new Suggestion('I Understand'))
    // Force user to select suggestion
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-iwo-request-disposable-income',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err.message, err)
  }
}

exports.iwoIsSupporting = async agent => {
  const isSupporting = agent.parameters.isSupporting.toLowerCase() === 'yes'
  try {
    await agent.add('Is your employee in arrears greater than 12 weeks?')
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
    console.error(err.message, err)
  }
}

exports.iwoInArrears = async agent => {
  const inArrears = agent.parameters.inArrears.toLowerCase() === 'yes'
  const isSupporting = await agent.context.get('iwo-factors').parameters
    .isSupporting
  const percentage = calculatePercentage(isSupporting, inArrears)
  const iwoFactorsParams = {
    ...agent.context.get('iwo-factors').parameters,
    percentage,
  }
  try {
    await agent.add(
      `Per the Consumer Credit Protection Act, in this case, the employer is responsible to withhold a maximum of ${percentage}% of  the employee's Net Disposable Income. This applies to one IWO or the combination of multiple IWO's.`
    )
    await agent.add(
      'Would you like assistance estimating the withholding amount?'
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
      parameters: iwoFactorsParams,
    })
  } catch (err) {
    console.error(err.message, err)
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
        `The estimated maximum amount that can be withheld is ${formatCurrency(
          amountToWithhold
        )} regardless of how many withholding orders you receive for this employee.`
      )
      await handleEndConversation(agent)
    } catch (err) {
      console.error(err.message, err)
    }
  } else {
    await agent.add(
      'I\'m sorry, something went wrong, please try again or contact <a href="tel:+18778824916">1-877-882-4916</a> for further assistance.'
    )
  }
}

exports.iwoQAArrearsBalance = async agent => {
  try {
    const { supportType } = require('./support.js')

    await supportType(agent, 'request payment history or record')
  } catch (err) {
    console.error(err.message, err)
  }
}
