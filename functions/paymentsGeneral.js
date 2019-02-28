const { Suggestion } = require('dialogflow-fulfillment')

exports.pmtsGeneralRoot = async agent => {
  try {
    await agent.add(`What can I help you with regarding payments?`)
    await agent.add(new Suggestion('Receive Payments'))
    await agent.add(new Suggestion('Make Payments'))
    await agent.add(new Suggestion('Withhold Payments'))
    await agent.add(new Suggestion('Estimate Payments'))
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralReceivePayments = async agent => {
  try {
    await agent.add(
      `You can receive payments by either the EPPICard or Direct Deposit, which would you like to learn more about?`
    )
    await agent.add(new Suggestion('Direct Deposit'))
    await agent.add(new Suggestion('EPPICard'))
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralMakePayments = async agent => {
  try {
    await agent.add(
      `Non-custodial parents have a variety of methods to make payments. Talk to your employer about a payroll deduction, or select one of the following to learn more.`
    )
    await agent.add(new Suggestion('Check or Money Order'))
    await agent.add(new Suggestion('Cash'))
    await agent.add(new Suggestion('eCheck/Bank Account Debit'))
    await agent.add(new Suggestion('Moneygram'))
    await agent.context.set({
      name: 'waiting-pmtMethods-checkOrMoneyOrder',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-cash',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-eCheckDebit',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-moneygram',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}
