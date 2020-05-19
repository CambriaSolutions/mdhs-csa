const { Suggestion } = require('dialogflow-fulfillment')
const isNumber = require('lodash/isNumber')
const {
  validateIncomeAndDeductions,
  calculatePayment,
} = require('./calculatePayment.js')
const {
  handleEndConversation,
  formatCurrency,
  disableInput,
} = require('../globalFunctions.js')

// User starts calculations process
exports.pmtCalcRoot = async agent => {
  await startCalculationProcess(agent)
}

// User restarts calculations process
exports.pmtCalcRootRestart = async agent => {
  await startCalculationProcess(agent)
}

const startCalculationProcess = async agent => {
  try {
    await agent.add(
      'This estimator can help you determine payments based on a single case involving a single biological family. While each case is unique, I can help get you an estimate.'
    )
    await agent.add(
      'If you need to know the exact amount you owe, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.'
    )
    await agent.add(new Suggestion('I Understand'))
    // Force user to select suggestion
    await disableInput(agent)
    await agent.context.set({
      name: 'waiting-pmt-calc-num-children',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User moves on to questions needed for payment calculations
exports.pmtCalcNumChildren = async agent => {
  try {
    await agent.add('First, how many children are part of this case?')
    await agent.context.set({
      name: 'waiting-pmt-calc-income-term',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User has provided the number of children
exports.pmtCalcIncomeTerm = async agent => {
  try {
    const numChildren = agent.parameters.numChildren

    if (!isNumber(numChildren)) {
      await agent.add(
        `Please provide a number of children to continue with the estimation.`
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-income-term',
        lifespan: 3,
      })
    } else if (numChildren < 1) {
      await agent.add(
        `You must have at least one child to get an estimate. How many children are part of this case?`
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-income-term',
        lifespan: 3,
      })
    } else if (numChildren % 1 !== 0) {
      await agent.add(`Please enter the number of children as a whole number.`)
      await agent.context.set({
        name: 'waiting-pmt-calc-income-term',
        lifespan: 3,
      })
    } else {
      // Set up a context to collect all payment factors needed for calculation
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 100,
        parameters: { numChildren },
      })

      await agent.add(
        `We also need an estimate of your income. How do you want to calculate your income?`
      )
      await agent.add(new Suggestion(`I don't know my income`))
      await agent.add(new Suggestion(`Monthly`))
      await agent.add(new Suggestion(`Weekly`))
      await agent.add(new Suggestion(`Bi-Weekly`))
      await agent.add(new Suggestion(`Annually`))
      await agent.context.set({
        name: 'waiting-pmt-calc-gross-income',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-income',
        lifespan: 3,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// User has replied that they do not know their income
exports.pmtCalcUnknownIncome = async agent => {
  try {
    await agent.add(
      `You can find your income statement on documents like a paystub or W-2 form. I can only estimate your child support payments if you know your income.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

// User has provided their income timeframe
exports.pmtCalcGrossIncome = async agent => {
  try {
    // Save income term in context
    const incomeTerm = agent.parameters.incomeTerm
    const paymentFactorsParams = {
      ...agent.context.get('payment-factors').parameters,
      incomeTerm,
    }

    await agent.add(
      `What is your ${incomeTerm} <strong>gross income</strong>? This includes all income before any deductions are subtracted.`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-tax-deductions',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-income',
      lifespan: 3,
    })

    // Keep log of payment factors
    await agent.context.set({
      name: 'payment-factors',
      parameters: paymentFactorsParams,
    })
  } catch (err) {
    console.error(err)
  }
}

// User provided it's gross income
exports.pmtCalcTaxDeductions = async agent => {
  try {
    const grossIncome = agent.parameters.grossIncome

    if (!isNumber(grossIncome)) {
      await agent.add(
        `I didn't catch that as a number, how much do you make before taxes and other deductions are taken out of your pay?`
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-tax-deductions',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-income',
        lifespan: 3,
      })
    } else if (grossIncome <= 0) {
      await agent.add(
        `For the purposes of this calculation, you will need to provide a gross income.`
      )
      await agent.add(
        `If you don't have any income, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office for assistance.`
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-tax-deductions',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-income',
        lifespan: 3,
      })
    } else {
      const paymentFactorsParams = {
        ...agent.context.get('payment-factors').parameters,
        grossIncome,
      }
      // Save gross income in context
      await agent.context.set({
        name: 'payment-factors',
        parameters: paymentFactorsParams,
      })

      await agent.add(
        'How much <strong>federal and state taxes</strong> are subtracted from your gross income?'
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-ss-deductions',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-tax-deductions',
        lifespan: 3,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// User doesn't know it's federal/state taxes
exports.pmtCalcUnknownTaxDeductions = async agent => {
  try {
    await agent.add(
      'Please provide an estimate of your federal and state taxes to continue with the estimation.'
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-ss-deductions',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-deductions',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User can't provide or doesn't even know an estimate of their deductions/contributions
exports.pmtCalcUnknownDeductions = async agent => {
  try {
    await agent.add(
      `I can only estimate your child support payments if you know your income & deductions.`
    )
    await agent.add(
      `For more information, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.`
    )
    // Clear out the payment factors context
    await agent.context.set({
      name: 'payment-factors',
      lifespan: 0,
    })
    // Keep option to recalculate payment open
    await agent.context.set({
      name: 'waiting-pmt-calc-restart',
      lifespan: 2,
    })
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

// User provided their tax deductions
exports.pmtCalcSSDeductions = async agent => {
  try {
    // Save tax deductions in context
    const taxDeductions = agent.parameters.taxDeductions

    const paymentFactorsParams = {
      ...agent.context.get('payment-factors').parameters,
      taxDeductions,
    }
    // Validate that income is higher than deductions
    if (await validateIncomeAndDeductions(paymentFactorsParams)) {
      await agent.add(
        'How much is subtracted from your gross income for <strong>social security contributions</strong>?'
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-retirement-contributions',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-ss-deductions',
        lifespan: 3,
      })

      // Keep log of payment factors
      await agent.context.set({
        name: 'payment-factors',
        parameters: paymentFactorsParams,
      })
    } else {
      await invalidDeductions(agent)
    }
  } catch (err) {
    console.error(err)
  }
}

// User doesn't know how much is substracted for their social security contributions
exports.pmtCalcUnknownSSDeductions = async agent => {
  try {
    await agent.add(
      'Please provide an estimate of your <strong>social security contributions</strong> to continue with the estimation.'
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-retirement-contributions',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-deductions',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

const invalidDeductions = async agent => {
  await agent.add(
    'Your deductions exceed your gross income, please start over with updated values.'
  )
  await agent.add(
    'For more information, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.'
  )
  await agent.add(new Suggestion(`Start over`))
  // Clear out the payment factors context
  await agent.context.set({
    name: 'payment-factors',
    lifespan: 0,
  })
  // Keep option to recalculate payment open
  await agent.context.set({
    name: 'waiting-pmt-calc-restart',
    lifespan: 2,
  })
  await handleEndConversation(agent)
}

// User provided their social security deductions
exports.pmtCalcRetirementContributions = async agent => {
  try {
    // Save social security deductions in context
    const ssDeductions = agent.parameters.ssDeductions

    const paymentFactorsParams = {
      ...agent.context.get('payment-factors').parameters,
      ssDeductions,
    }
    // Validate that income is higher than deductions
    if (await validateIncomeAndDeductions(paymentFactorsParams)) {
      await agent.add(
        'Does your employer require you to contribute to a <strong>retirement account</strong> in which you may not opt out?'
      )
      await agent.add(new Suggestion(`Yes`))
      await agent.add(new Suggestion(`No`))
      await agent.context.set({
        name: 'waiting-pmt-calc-retirement-contributions-amount',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-child-support-no-retirement',
        lifespan: 3,
      })

      // Keep log of payment factors
      await agent.context.set({
        name: 'payment-factors',
        parameters: paymentFactorsParams,
      })
    } else {
      await invalidDeductions(agent)
    }
  } catch (err) {
    console.error(err)
  }
}

// User is required to contribute to a retirement account
exports.pmtCalcRetirementContributionsAmount = async agent => {
  try {
    await agent.add(
      `How much is subtracted from your gross income for this purpose?`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-child-support',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-retirement-contributions',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User doesn't know how much is substracted for their social security contributions
exports.pmtCalcUnknownRetirementContributions = async agent => {
  try {
    await agent.add(
      'Please provide an estimate of how much your employer requires you to contribute to a retirement account to continue with the estimation.'
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-child-support',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-deductions',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User stated he contributes to a retirement account
exports.pmtCalcChildSupport = async agent => {
  // Save retirement contributions in context
  await existingChildSupport(agent, agent.parameters.retirementContributions)
}

// User stated he does not contribute to a retirement account
exports.pmtCalcChildSupportNoRetirement = async agent => {
  await existingChildSupport(agent, 0)
}

const existingChildSupport = async (agent, retirementContributions) => {
  try {
    const paymentFactorsParams = {
      ...agent.context.get('payment-factors').parameters,
      retirementContributions,
    }
    // Validate that income is higher than deductions & contributions
    if (await validateIncomeAndDeductions(paymentFactorsParams)) {
      await agent.add(
        `Do you have any <strong>existing monthly child support</strong> order(s) for other children?`
      )
      await agent.add(new Suggestion(`Yes`))
      await agent.add(new Suggestion(`No`))
      await agent.context.set({
        name: 'waiting-pmt-calc-child-support-amount',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-final-estimation-no-other-children',
        lifespan: 3,
      })

      // Save retirement contributions in context
      await agent.context.set({
        name: 'payment-factors',
        parameters: paymentFactorsParams,
      })
    } else {
      await invalidDeductions(agent)
    }
  } catch (err) {
    console.error(err)
  }
}

// User is already paying for child support for other children
exports.pmtCalcChildSupportAmount = async agent => {
  try {
    await agent.add(
      `What are your <strong>monthly</strong> child support obligations?`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-final-estimation',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-other-child-support',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User doesn't know how much is substracted for their social security contributions
exports.pmtCalcUnknownOtherChildSupport = async agent => {
  try {
    await agent.add(
      'Please provide an estimate of your current child support obligations to continue with the estimation.'
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-final-estimation',
      lifespan: 3,
    })
    await agent.context.set({
      name: 'waiting-pmt-calc-unknown-deductions',
      lifespan: 3,
    })
  } catch (err) {
    console.error(err)
  }
}

// User is paying for child support for other children, let's calculate the final payment
exports.pmtCalcFinalEstimation = async agent => {
  let paymentFactors = await agent.context.get('payment-factors').parameters
  paymentFactors.otherChildSupport = agent.parameters.otherChildSupport
  await finalPaymentCalculation(agent, paymentFactors)
}

// User is NOT paying for child support for other children. move on to calculations
exports.pmtCalcFinalEstimationNoOtherChildren = async agent => {
  let paymentFactors = await agent.context.get('payment-factors').parameters
  paymentFactors.otherChildSupport = 0
  await finalPaymentCalculation(agent, paymentFactors)
}

const finalPaymentCalculation = async (agent, paymentFactors) => {
  try {
    // Validate that income is higher than deductions
    if (await validateIncomeAndDeductions(paymentFactors)) {
      const calculatedPayment = await calculatePayment(paymentFactors)

      await agent.add(
        `Based on the information you provided, your support obligation will be <strong>${formatCurrency(
          calculatedPayment
        )}</strong> monthly.`
      )
      await agent.add(
        `The information provided in this calculation is only an estimate. For more information, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.`
      )

      // Clear out the payment factors context
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 0,
      })
      // Keep option to recalculate payment open
      await agent.context.set({
        name: 'waiting-pmt-calc-restart',
        lifespan: 2,
      })
      // Ask the user if they need anything else, set appropriate contexts
      await handleEndConversation(agent)
    } else {
      await invalidDeductions(agent)
    }
  } catch (err) {
    console.error(err)
    await agent.add(
      `Something went wrong, please try again, or call <a href="tel:+18778824916">1-877-882-4916</a> for immediate support.`
    )
    await agent.add(new Suggestion('Recalculate'))
    await agent.context.set({
      name: 'waiting-pmt-calc-restart',
      lifespan: 2,
    })
  }
}
