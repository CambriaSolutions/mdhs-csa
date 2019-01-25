const { Suggestion } = require('dialogflow-fulfillment')
const {
  getIncomeMultiplier,
  getSupportBracket,
} = require('./calculatePayment.js')

exports.pmtRoot = async agent => {
  try {
    await agent.add(
      'Each case is unique, but I can help get you an estimate. If you need to know the exact amount you owe, please call 1-877-882-4916 or visit a local child support office.'
    )
    await agent.add(new Suggestion('I Understand'))
    await agent.context.set({
      name: 'waiting-pmt-timeframe',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtTimeframe = async agent => {
  try {
    await agent.add(
      'First, we need an estimate of your income. Which timeframe would you like to provide it in?'
    )
    await agent.add(new Suggestion(`I don't know my income`))
    await agent.add(new Suggestion(`Bi-Weekly`))
    await agent.add(new Suggestion(`Monthly`))
    await agent.add(new Suggestion(`Annual`))
    await agent.context.set({
      name: 'waiting-pmt-handle-timeframe',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-unknown-income',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtUnknownIncome = async agent => {
  try {
    await agent.add(
      `You can find your income statement on documents like a paystub or W-2 form. I can only estimate your child support payments if you know your income.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.pmtHandleTimeframe = async agent => {
  const cadence = agent.parameters.cadence
  const incomeMultiplier = getIncomeMultiplier(cadence)
  try {
    await agent.add(
      `How much do you make per [time period] after taxes and other deductions are taken out of your pay?`
    )
    await agent.context.set({
      name: 'waiting-pmt-earnings',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'payment-factors',
      lifespan: 100,
      parameters: { incomeMultiplier },
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtEarnings = async agent => {
  const earnings = agent.parameters.earnings

  // TODO: validate earnings
  try {
    await agent.add(
      `Just a few more questions about your children. First, how many children do you have?`
    )
    await agent.context.set({
      name: 'waiting-pmt-num-children',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'payment-factors',
      parameters: { earnings },
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtNumChildren = async agent => {
  const numChildren = agent.parameters.numChildren
  const supportBracket = getSupportBracket(numChildren)
  // TODO: validate earnings
  try {
    await agent.add(`How many mothers are there for your children?`)
    await agent.context.set({
      name: 'waiting-pmt-num-mothers',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'payment-factors',
      parameters: { supportBracket },
    })
  } catch (err) {
    console.log(err)
  }
}
