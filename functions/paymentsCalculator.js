const { Suggestion } = require("dialogflow-fulfillment");
const isNumber = require("lodash/isNumber");
const { calculatePayment } = require("./calculatePayment.js");
const {
  handleEndConversation,
  formatCurrency,
} = require("./globalFunctions.js");

// User starts calculations process
exports.pmtCalcRoot = async agent => {
  await startCalculationProcess(agent);
};

// User restarts calculations process
exports.pmtCalcRootRestart = async agent => {
  await startCalculationProcess(agent);
};

const startCalculationProcess = async agent => {
  try {
    await agent.add(
      "This estimator can help you determine payments based on a single case involving a single biological family. While each case is unique, I can help get you an estimate."
    );
    await agent.add(
      'If you need to know the exact amount you owe, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.'
    );
    await agent.add(new Suggestion("I Understand"));
    await agent.context.set({
      name: "waiting-pmt-calc-num-children",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User moves on to questions needed for payment calculations
exports.pmtCalcNumChildren = async agent => {
  try {
    await agent.add("First, how many children are part of this case?");
    await agent.context.set({
      name: "waiting-pmt-calc-income-term",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User has provided the number of children
exports.pmtCalcIncomeTerm = async agent => {
  try {
    const numChildren = agent.parameters.numChildren;
    // Set up a context to collect all payment factors needed for calculation
    await agent.context.set({
      name: "payment-factors",
      lifespan: 100,
      parameters: { numChildren },
    });

    await agent.add(
      `We also need an estimate of your income. How do you want to calculate your income?`
    );
    await agent.add(new Suggestion(`I don't know my income`));
    await agent.add(new Suggestion(`Monthly`));
    await agent.add(new Suggestion(`Weekly`));
    await agent.add(new Suggestion(`Bi-Weekly`));
    await agent.add(new Suggestion(`Annually`));
    await agent.context.set({
      name: "waiting-pmt-calc-gross-income",
      lifespan: 3,
    });
    await agent.context.set({
      name: "waiting-pmt-calc-unknown-income",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User has replied that they do not know their income
exports.pmtCalcUnknownIncome = async agent => {
  try {
    await agent.add(
      `You can find your income statement on documents like a paystub or W-2 form. I can only estimate your child support payments if you know your income.`
    );
    await handleEndConversation(agent);
  } catch (err) {
    console.error(err);
  }
};

// User has provided their income timeframe
exports.pmtCalcGrossIncome = async agent => {
  try {
    // Save income term in context
    const incomeTerm = agent.parameters.incomeTerm;
    await agent.context.set({
      name: "payment-factors",
      parameters: { incomeTerm },
    });

    await agent.add(
      `What is your <b>gross income</b>? This includes all income before any deductions are subtracted.`
    );
    await agent.context.set({
      name: "waiting-pmt-calc-tax-deductions",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User provided it's gross income
exports.pmtCalcTaxDeductions = async agent => {
  try {
    // Save gross income in context
    const grossIncome = agent.parameters.grossIncome;
    await agent.context.set({
      name: "payment-factors",
      parameters: { grossIncome },
    });

    await agent.add(
      "How much <b>federal and state taxes</b> are subtracted from your gross income?"
    );
    await agent.context.set({
      name: "waiting-pmt-calc-ssn-deductions",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User provided their tax deductions
exports.pmtCalcSSNDeductions = async agent => {
  try {
    // Save tax deductions in context
    const taxDeductions = agent.parameters.taxDeductions;
    await agent.context.set({
      name: "payment-factors",
      parameters: { taxDeductions },
    });

    await agent.add(
      "How much is subtracted from your gross income for social security contributions?"
    );
    await agent.context.set({
      name: "waiting-pmt-calc-retirement-contributions",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User provided their social security deductions
exports.pmtCalcRetirementContributions = async agent => {
  try {
    // Save ssn deductions in context
    const ssnDeductions = agent.parameters.ssnDeductions;
    await agent.context.set({
      name: "payment-factors",
      parameters: { ssnDeductions },
    });

    await agent.add(
      "Does your employer require you to contribute to a <b>retirement account</b> in which you may not opt out?"
    );
    await agent.add(new Suggestion(`Yes`));
    await agent.add(new Suggestion(`No`));
    await agent.context.set({
      name: "waiting-pmt-calc-retirement-contributions-amount",
      lifespan: 3,
    });
    await agent.context.set({
      name: "waiting-pmt-calc-child-support-no-retirement",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User is required to contribute to a retirement account
exports.pmtCalcRetirementContributionsAmount = async agent => {
  try {
    await agent.add(
      `How much is subtracted from your gross income for this purpose?`
    );
    await agent.context.set({
      name: "waiting-pmt-calc-child-support",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User stated he contributes to a retirement account
exports.pmtCalcChildSupport = async agent => {
  // Save retirement contributions in context
  await existingChildSupport(agent, agent.parameters.retirementContributions);
};

// User stated he does not contribute to a retirement account
exports.pmtCalcChildSupportNoRetirement = async agent => {
  await existingChildSupport(agent, 0);
};

const existingChildSupport = async (agent, retirementContributions) => {
  try {
    // Save retirement contributions in context
    await agent.context.set({
      name: "payment-factors",
      parameters: { retirementContributions },
    });

    await agent.add(
      `Do you have any <b>existing monthly child support</b> order(s) for other children?`
    );
    await agent.add(new Suggestion(`Yes`));
    await agent.add(new Suggestion(`No`));
    await agent.context.set({
      name: "waiting-pmt-calc-child-support-amount",
      lifespan: 3,
    });
    await agent.context.set({
      name: "waiting-pmt-calc-final-estimation-no-other-children",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User already is paying for child support for other children
exports.pmtCalcChildSupportAmount = async agent => {
  try {
    const paymentFactors = await agent.context.get("payment-factors")
      .parameters;

    await agent.add(
      `How much are you currently court ordered to pay ${`${
        paymentFactors.incomeTerm
      }`.toLowerCase()} in child support?`
    );
    await agent.context.set({
      name: "waiting-pmt-calc-final-estimation",
      lifespan: 3,
    });
  } catch (err) {
    console.error(err);
  }
};

// User is paying for child support for other children, let's calculate the final payment
exports.pmtCalcFinalEstimation = async agent => {
  let paymentFactors = await agent.context.get("payment-factors").parameters;
  paymentFactors.otherChildSupport = agent.parameters.otherChildSupport;
  await finalPaymentCalculation(agent, paymentFactors);
};

// User is NOT paying for child support for other children. move on to calculations
exports.pmtCalcFinalEstimationNoOtherChildren = async agent => {
  let paymentFactors = await agent.context.get("payment-factors").parameters;
  paymentFactors.otherChildSupport = 0;
  await finalPaymentCalculation(agent, paymentFactors);
};

const finalPaymentCalculation = async (agent, paymentFactors) => {
  try {
    const calculatedPayment = await calculatePayment(paymentFactors);

    await agent.add(
      `Based on the information you provided, your support obligation will be ${formatCurrency(
        calculatedPayment
      )}.`
    );
    await agent.add(
      `The information provided in this calculation is only an estimate. For more information, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.`
    );

    // Clear out the payment factors context
    await agent.context.set({
      name: "payment-factors",
      lifespan: 0,
    });
    // Keep option to recalculate payment open
    await agent.context.set({
      name: "waiting-pmt-calc-restart",
      lifespan: 2,
    });
    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent);
  } catch (err) {
    console.error(err);
    await agent.add(
      `Something went wrong, please try again, or call <a href="tel:+18778824916">1-877-882-4916</a> for immediate support.`
    );
    await agent.add(new Suggestion("Recalculate"));
    await agent.context.set({
      name: "waiting-pmt-calc-restart",
      lifespan: 2,
    });
  }
};

/*

// User has provided a timeframe with which they will proceed with calculations
exports.pmtCalcHandleTimeframe = async agent => {
  // This intent uses entities to handle variations of the allowed candences below
  const cadence = agent.parameters.cadence
  const allowedCadences = ['biweekly', 'monthly', 'annual']

  // The user has provided an invalid cadence
  if (!allowedCadences.includes(cadence)) {
    try {
      await agent.add(
        `${cadence} is not an allowed cadence for estimating payments, please choose monthly, or annual.`
      )
      await agent.add(new Suggestion(`I don't know my income`))
      await agent.add(new Suggestion(`Monthly`))
      await agent.add(new Suggestion(`Annual`))
      await agent.context.set({
        name: 'waiting-pmt-calc-handle-timeframe',
        lifespan: 3,
      })
      await agent.context.set({
        name: 'waiting-pmt-calc-unknown-income',
        lifespan: 3,
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    // Prep the cadence to be conversational language
    let preppedCadence
    if (cadence === 'monthly') {
      preppedCadence = 'month'
    } else if (cadence === 'annual') {
      preppedCadence = 'year'
    }
    try {
      await agent.add(
        `We will need your ${cadence} income after taxes and deductions to continue the estimation.`
      )
      await agent.add(`Deductions include: 
      1. Federal and state taxes
      2. Other existing child support payments
      3. Required employer retirement contribution
      4. Social Security withholding
      `)
      await agent.add(
        `Other deductions may apply. To get an even more accurate estimate, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.`
      )
      await agent.add(
        `How much do you make every ${preppedCadence} after taxes and other deductions are taken out of your pay?`
      )
      await agent.context.set({
        name: 'waiting-pmt-calc-income',
        lifespan: 3,
      })

      // Set up a context to collect all payment factors needed for calculation
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 100,
        parameters: { cadence },
      })
    } catch (err) {
      console.error(err)
    }
  }
}

// User has provided how much they make per timeframe
exports.pmtCalcIncome = async agent => {
  const income = agent.parameters.income

  if (!isNumber(income) || income === 0) {
    await agent.add(
      `I didn't catch that as a number, how much do you make after taxes and other deductions are taken out of your pay?`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-income',
      lifespan: 3,
    })
  }

  try {
    await agent.add(
      `How many children are part of this case and biological family?`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-num-children',
      lifespan: 3,
    })

    // Save income in context
    await agent.context.set({
      name: 'payment-factors',
      parameters: { income },
    })
  } catch (err) {
    console.error(err)
  }
}

// The user has provided the number of children
exports.pmtCalcNumChildren = async agent => {
  const numChildren = agent.parameters.numChildren

  if (!isNumber(numChildren)) {
    await agent.add(
      `Please provide the number, as a whole number, of children to continue with the estimation.`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-num-children',
      lifespan: 3,
    })
  } else if (numChildren < 1) {
    await agent.add(
      `You must have at least one child to provide and estimate for support obligations. How many children do you have?`
    )
    await agent.context.set({
      name: 'waiting-pmt-calc-num-children',
      lifespan: 3,
    })
  } else if (numChildren % 1 !== 0) {
    await agent.add(`Please revise the number of children as a whole number.`)
    await agent.context.set({
      name: 'waiting-pmt-calc-num-children',
      lifespan: 3,
    })
  } else {
    // We have enough information to calculate support obligations.
    // Retrieve the factors from context, and set numChildren as 1 prior to calculations
    const paymentFactors = await agent.context.get('payment-factors').parameters
    paymentFactors.numChildren = 1

    // Calculate the support obligation
    try {
      const calculatedPayment = await calculatePayment(paymentFactors)
      await agent.add(
        `Based on the information you provided, your monthly support obligation will be $${calculatedPayment}.`
      )
      await agent.add(
        `The information provided in this calculation is only an estimate. For more information, please call <a href="tel:+18778824916">1-877-882-4916</a> or visit a local child support office.`
      )
      // Clear out the payment factors context
      await agent.context.set({
        name: 'payment-factors',
        lifespan: 0,
      })
      // Remove the context for the next intent, needed if they have more than 1 mother
      // await agent.context.set({
      //   name: 'waiting-pmt-num-children',
      //   lifespan: 0,
      // })

      // Ask the user if they need anything else, set appropriate contexts
      await handleEndConversation(agent)
    } catch (err) {
      console.error(err)
      await agent.add(
        `Something went wrong, please try again, or call <a href="tel:+18778824916">1-877-882-4916</a> for immediate support.`
      )
      await agent.add(new Suggestion('Recalculate'))
      await agent.context.set({
        name: 'waiting-pmt-calc-timeframe',
        lifespan: 3,
      })
    }
  }
}
*/

// Saving in case we expand to add more mothers.

// // The user has provided the number of mothers, giving us all the
// // information needed to calculate monthly support obligations
// exports.pmtCalcNumMothers = async agent => {
//   // Retrieve payment information from context
//   const paymentFactors = await agent.context.get('payment-factors').parameters
//   // Calculate the support obligation
//   try {
//     const calculatedPayment = await calculatePayment(paymentFactors)
//     await agent.add(
//       `Based on the information you provided, your monthly support obligation will be $${calculatedPayment}`
//     )
//     await agent.add(
//       `The information provided in this calculation is only an estimate. For more information, please call 1-877-882-4916 or visit a local child support office.`
//     )

//     // Clear out the payment factors context
//     await agent.context.set({
//       name: 'payment-factors',
//       lifespan: 0,
//     })

//     // Ask the user if they need anything else, set appropriate contexts
//     await handleEndConversation(agent)
//   } catch (err) {
//     console.error(err)
//     await agent.add(
//       `Something went wrong, please try again, or call 1-877-882-4916 for immediate support.`
//     )
//     await agent.add(new Suggestion('Recalculate'))
//     await agent.context.set({
//       name: 'waiting-pmt-timeframe',
//       lifespan: 3,
//     })
//   }
// }
