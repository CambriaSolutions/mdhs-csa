const { Suggestion } = require('dialogflow-fulfillment')
const isNumber = require('lodash/isNumber')
const { calculatePayment } = require('./calculatePayment.js')

// User has opted into determining child support payments
exports.pmtRoot = async agent => {
  try {
    await agent.add(
      'Each case is unique, but I can help get you an estimate. If you need to know the exact amount you owe, please call 1-877-882-4916 or visit a local child support office.'
    )
    await agent.add(new Suggestion('I Understand'))
    await agent.context.set({
      name: 'waiting-pmt-timeframe',
      lifespan: 3,
    })
  } catch (err) {
    console.log(err)
  }
}

// User has consented to the payment being an estimate only
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
      lifespan: 3,
    })
  } catch (err) {
    console.log(err)
  }
}

// User has replied that they do not know their income
exports.pmtUnknownIncome = async agent => {
  try {
    await agent.add(
      `You can find your income statement on documents like a paystub or W-2 form. I can only estimate your child support payments if you know your income.`
    )
  } catch (err) {
    console.log(err)
  }
}

// User has provided a timeframe with which they will proceed with calculations
exports.pmtHandleTimeframe = async agent => {
  // This intent uses entities to handle variations of the allowed candences below
  const cadence = agent.parameters.cadence
  const allowedCadences = ['biweekly', 'monthly', 'annual']

  // The user has provided an invalid cadence
  if (!allowedCadences.includes(cadence)) {
    try {
      await agent.add(
        `${cadence} is not an allowed cadence for estimating payments, please choose from bi-weekly, monthly, or annual.`
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
        lifespan: 3,
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    // Prep the cadence to be conversational language
    let preppedCadence
    if (cadence === 'biweekly') {
      preppedCadence = 'two weeks'
    } else if (cadence === 'monthly') {
      preppedCadence = 'month'
    } else if (cadence === 'annual') {
      preppedCadence = 'year'
    }
    try {
      await agent.add(
        `How much do you make every ${preppedCadence} after taxes and other deductions are taken out of your pay?`
      )
      await agent.context.set({
        name: 'waiting-pmt-income',
        lifespan: 3,
      })

      // Set up a context to collect all payment factors needed for calculation
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 100,
        parameters: { cadence },
      })
    } catch (err) {
      console.log(err)
    }
  }
}

// User has provided how much they make per timeframe
exports.pmtIncome = async agent => {
  const income = agent.parameters.income

  if (!isNumber(income) || income === 0) {
    await agent.add(
      `I didn't catch that as a number, how much do you make after taxes and other deductions are taken out of your pay?`
    )
    await agent.context.set({
      name: 'waiting-pmt-income',
      lifespan: 3,
    })
  }

  try {
    await agent.add(
      `Just a few more questions about your children. First, how many children do you have?`
    )
    await agent.context.set({
      name: 'waiting-pmt-num-children',
      lifespan: 3,
    })

    // Save income in context
    await agent.context.set({
      name: 'payment-factors',
      parameters: { income },
    })
  } catch (err) {
    console.log(err)
  }
}

// The user has provided the number of children
exports.pmtNumChildren = async agent => {
  const numChildren = agent.parameters.numChildren

  if (!isNumber(numChildren)) {
    await agent.add(
      `Please provide the number, as a whole number, of children to continue with the estimation.`
    )
    await agent.context.set({
      name: 'waiting-pmt-num-children',
      lifespan: 3,
    })
  } else if (numChildren < 1) {
    await agent.add(
      `You must have at least one child to provide and estimate for support obligations. How many children do you have?`
    )
    await agent.context.set({
      name: 'waiting-pmt-num-children',
      lifespan: 3,
    })
  } else if (numChildren % 1 !== 0) {
    await agent.add(`Please revise the number of children as a whole number.`)
    await agent.context.set({
      name: 'waiting-pmt-num-children',
      lifespan: 3,
    })
  } else if (numChildren === 1) {
    // We have enough information to calculate support obligations.
    // Retrieve the factors from context, and set numChildren as 1 prior to calculations
    const paymentFactors = await agent.context.get('payment-factors').parameters
    paymentFactors.numChildren = 1
    // per
    const calculatedPayment = calculatePayment(paymentFactors)
    try {
      await agent.add(
        `Based on the information you provided, your monthly support obligation will be $${calculatedPayment}`
      )
      await agent.add(
        `The information provided in this calculation is only an estimate. For more information, please call 1-877-882-4916 or visit a local child support office.`
      )
      await agent.context.set({
        name: 'waiting-pmt-num-children',
        lifespan: 0,
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    try {
      await agent.add(`How many mothers are there for your children?`)
      await agent.context.set({
        name: 'waiting-pmt-num-mothers',
        lifespan: 3,
      })

      // Save number of children in context
      await agent.context.set({
        name: 'payment-factors',
        parameters: { numChildren },
      })
    } catch (err) {
      console.log(err)
    }
  }
}

// The user has provided the number of mothers, giving us all the
// information needed to calculate monthly support obligations
exports.pmtNumMothers = async agent => {
  // Retrieve payment information from context
  const paymentFactors = await agent.context.get('payment-factors').parameters
  // Calculate the support obligation
  const calculatedPayment = calculatePayment(paymentFactors)
  if (paymentFactors) {
    try {
      await agent.add(
        `Based on the information you provided, your monthly support obligation will be $${calculatedPayment}`
      )
      await agent.add(
        `The information provided in this calculation is only an estimate. For more information, please call 1-877-882-4916 or visit a local child support office.`
      )
      // Clear out the payment factors context
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 0,
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    try {
      await agent.add(
        `Something went wrong, please try again, or call 1-877-882-4916 for immediate support.`
      )
    } catch (err) {
      console.log(err)
    }
  }
}
