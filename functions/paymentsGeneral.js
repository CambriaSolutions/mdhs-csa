const { Suggestion } = require('dialogflow-fulfillment')

exports.pmtsGeneralRoot = async agent => {
  try {
    await agent.add(`Are you the parent who is or will be receiving payments?`)
    await agent.context.set({
      name: 'waiting-pmts-general-receive-payments',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmts-general-not-parent',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralNotParent = async agent => {
  try {
    await agent.add(`What can I help you with regarding payments?`)
    await agent.add(new Suggestion('Make Payments'))
    await agent.add(new Suggestion('None of These'))
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralReceivePayments = async agent => {
  try {
    await agent.add(
      `The easiest way to receive payments is through the EPPICard. The other option, which takes longer to set up is Direct Deposit. Which would you like to learn more about?`
    )
    await agent.add(new Suggestion('Debit Card'))
    await agent.add(new Suggestion('Direct Deposit'))
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralDebitCard = async agent => {
  try {
    await agent.add(
      `MDHS will issue Child Support payments to a debit card, unless the custodial parent chooses to receive payments via direct deposit.`
    )
    await agent.add(
      `For information about fees associated with the debit card or other information, visit [url] or call their support line at <a href="tel:+18664614095">1-866-461-4095</a>.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.pmtsGeneralMakePayments = async agent => {
  try {
    await agent.add(
      `Non-custodial parents have a variety of methods to make payments.<br/><br/>For payment options other than having payments withheld from your pay, select one of the following to learn more.<br/><br/>The date the payment is received is the date of collection. Payments cannot be posted for a prior month.<br/><br/>Payments are not considered to be recieved by MDHS until all payment processing has occurred.`
    )

    await agent.add(new Suggestion('Check or Money Order'))
    await agent.add(new Suggestion('Cash'))
    await agent.add(new Suggestion('Estimate Payments'))
    await agent.add(new Suggestion('Withhold Payments'))
    await agent.add(new Suggestion('eCheck/Bank Account Debit'))
    await agent.add(new Suggestion('Moneygram'))
    await agent.add(new Suggestion("Can't Make Payments"))

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
    await agent.context.set({
      name: 'waiting-pmtMethods-cant-make',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}
