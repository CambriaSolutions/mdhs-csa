const { Suggestion } = require('dialogflow-fulfillment')
const {
  calculatePercentage,
  handleEndConversation,
  formatCurrency,
  disableInput,
} = require('../globalFunctions')
const { pmtsGeneralMakePayments } = require('./paymentsGeneral')
const { supportType } = require('./support.js')

exports.iwoRoot = async agent => {
  try {
    await agent.add('Which of the following is most relevant to your inquiry?')
    await agent.add(
      'CCPA Calculator: These guidelines help you determine how much to withhold to be in compliance with the Consumer Credit Protection Act'
    )
    await agent.add('FAQs: Regarding Income Withholding Orders')
    await agent.add(
      'Report Information About the Parent who Pays Support: Report information about the parent who provides support like change in their address, salary change, employment change, etc.'
    )

    await agent.add(new Suggestion('CCPA Calculator'))
    await agent.add(new Suggestion('FAQs'))
    await agent.add(
      new Suggestion('Report Information About the Parent who Pays Support')
    )
    await agent.context.set({
      name: 'waiting-iwo-wants-assistance',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-iwo-no-assistance',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-iwo-faqs',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoCcpaRoot = async agent => {
  try {
    await agent.add(
      'The Consumer Credit Protection Act limits earnings that may be withheld. Earnings are subject to withholding limits that range between 50-65%. The withholding order will specify the CCPA cap amount based on information known to MDHS.'
    )
    await agent.add(
      'Would you like assistance estimating the CCPA percentage that may apply to a particular case?'
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

exports.iwoFAQs = async agent => {
  try {
    await agent.add(
      'Sure, I can help answer general questions you might have about Income Withholding Orders. What is your question?'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoWantsAssistance = async agent => {
  try {
    await agent.add(
      'Is your employee supporting a family other than the one(s) for whom support is being withheld?'
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
    console.error(err)
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
    console.error(err)
  }
}

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
    console.error(err)
  }
}

exports.iwoRequestDisposableIncome = async agent => {
  try {
    await agent.add('What is the employee\'s disposable income?')
    await agent.add(new Suggestion('Disposable Income Definition'))
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
      'Disposable income = gross pay - mandatory deductions such as federal, state and local taxes, unemployment insurance, workers\' compensation insurance, mandatory retirement deductions, and other deductions determined by state law. Health insurance premiums may be included in a state\'s mandatory deductions; they are mandatory deductions for federal employees.'
    )

    await agent.add(
      'Note: Disposable income is not necessarily the same as net pay. For more detailed information, <a href="https://www.acf.hhs.gov/css/resource/processing-an-income-withholding-order-or-notice" target="_blank">click here</a> to access the U.S. Department of Health and Human Services, Office of Child Support Enforcement website.'
    )
    await agent.add('What is the employee\'s disposable income?')
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
        `The estimated maximum amount that can be withheld is ${formatCurrency(
          amountToWithhold
        )} regardless of how many withholding orders you receive for this employee.`
      )
      await handleEndConversation(agent)
    } catch (err) {
      console.log(err)
    }
  } else {
    await agent.add(
      'I\'m sorry, something went wrong, please try again or contact <a href="tel:+18778824916">1-877-882-4916</a> for further assistance.'
    )
  }
}

exports.iwoWhereToSubmit = async agent => {
  try {
    await agent.add('Who are you?')
    await agent.add(new Suggestion('Employer'))
    await agent.add(
      new Suggestion(
        'Parent who is responsible for making child support payments'
      )
    )
    await agent.context.set({
      name: 'waiting-iwo-employer-submit-payments',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-iwo-payments-handoff',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.iwoEmployerSubmitPayments = async agent => {
  try {
    await agent.add(
      'Employers can make payments electronically through iPayOnline or EFT payments.'
    )
    await agent.add(
      'For information on how to enroll, you can call <a href="tel:+1-769-777-6111">1-769-777-6111</a> or by emailing <a href="mailto:MSSDUOutreach@informatixinc.com">MSSDUOutreach@informatixinc.com</a>'
    )
    await agent.add(
      `The employer may submit payments to the State Disbursement Unit per the Income Withholding Order. Submit payments to:
         MDHS/SDU
         PO Box 23094
         Jackson, MS 39225
        `
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoPaymentsHandoff = async agent => {
  try {
    await pmtsGeneralMakePayments(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.iwoAdministrativeFee = async agent => {
  try {
    await agent.add(
      'Yes, the administrative fee is included in the payment specified on the IWO.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoOtherGarnishments = async agent => {
  try {
    await agent.add(
      'Child Support payments take precedence over all other garnishments, except the IRS when the employer receives the IRS garnishment first.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoOtherState = async agent => {
  try {
    await agent.add(
      'Please contact DHS customer support at <a href="tel:+18778824916">1-877-882-4916</a> to help with this request.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoInsuranceCoverage = async agent => {
  try {
    await agent.add(
      'If you received a National Medical Support Notice, the NCP must provide dependent health insurance.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoNotAnEmployee = async agent => {
  try {
    await agent.add(
      `Per the IWO, the employer is required to respond with employment history to:<br/>
      MDHS-Division of Child Support<br/>
      950 E. County Line Rd.<br/>
      Suite #G<br/>
      Ridgeland, MS 39157.
      `
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoFireEmployee = async agent => {
  try {
    await agent.add(
      'Per MS state law, if you were to fire an employee due to a garnishment, you are subject to a fine. (Page 4 of IWO - anti discrimination section).'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoEmployerObligation = async agent => {
  try {
    await agent.add(
      'As the employer, you are obligated to withhold per the Consumer Credit Protection Act guidelines.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoWhenToBegin = async agent => {
  try {
    await agent.add(
      'The next payable income for the employee after 14 days following receipt of the IWO.'
    )
  } catch (err) {
    console.error(err)
  }
}

exports.iwoHowLongToSend = async agent => {
  try {
    await agent.add('7 days')
  } catch (err) {
    console.error(err)
  }
}

exports.iwoQAArrearsBalance = async agent => {
  try {
    await supportType(agent, 'request payment history or record')
  } catch (err) {
    console.error(err)
  }
}
