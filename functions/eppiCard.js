const { Suggestion, Card } = require('dialogflow-fulfillment')

exports.eppiRoot = async agent => {
  try {
    await agent.add(
      `Sure, I can help with the following topics regarding your payment card.`
    )
    await agent.add(new Suggestion('Replace, Report Stolen, Lost or Fraud'))
    await agent.add(new Suggestion('Get EPPICard'))
    await agent.add(new Suggestion('Activate'))
    await agent.add(new Suggestion('Fees'))
    await agent.add(new Suggestion('Set Up Notifications'))
    await agent.add(new Suggestion('FAQ'))
    await agent.context.set({
      name: 'waiting-eppi-get-card',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-eppi-activate',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-eppi-replace-report',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-eppi-fees',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-eppi-notifications',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-eppi-faq',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.eppiGetCard = async agent => {
  try {
    await agent.add(
      `The default payment method for all Child Support cases is the EPPI Card. To activate the EPPI Card, you can either call 1-877-882-4916 or visit a local Child Support office.`
    )
    await agent.add(
      `If you are receiving payments by paper check, you can change it to the EPPI Card.`
    )
    await agent.add(
      `To learn more about EPPI Cards, [click here] to visit the EPPI Card website or call their support line at 1-866-461-4095.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiActivateCard = async agent => {
  try {
    await agent.add(
      `When you recieve your card, call 1-866-461-4095 to activate your card and create your PIN. You will need your card number, Social Security Number and Date of Birth to complete the activation process.`
    )
    await agent.add(`Remember to sign your name on the back of the card!`)
  } catch (err) {
    console.log(err)
  }
}

exports.eppiFees = async agent => {
  try {
    await agent.add(
      new Card({
        title: `ATM Withdrawals "in-network"`,
        text: `
        Total of three (3) free each calendar month; $1.75 each for any additional.
       `,
      })
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiNotifications = async agent => {
  try {
    await agent.add(
      `You can register your mobile phone to receive deposit notifications and balance alerts at www.EPPICard.com or call 1-866-461-4095`
    )
    await agent.add(
      `Remember, you are allowed five (5) calls per calendar month to the Mississippi EPPICard Customer Service at no cost. The sixth and subsequent calls per month cost $0.50.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiReplaceReport = async agent => {
  try {
    await agent.add(
      `To replace an EPPI Card, to report a lost, or stolen card, or report fraud, contact EPPI Customer Service at 1-866-461-4095.`
    )
    await agent.add(
      `Remember, you are allowed five (5) calls per calendar month to the Mississippi EPPICard Customer Service at no cost. The sixth and subsequent calls per month cost $0.50. `
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiFAQ = async agent => {
  try {
    await agent.add(
      `Sure, I can help answer general questions you might have about the EPPI Card. What is your question?`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiPaymentHistory = async agent => {
  try {
    await agent.add(
      new Card({
        title: `Transaction History`,
        text: `To access your payments or transaction history, you will need to create an account through the EPPI Card website. Once you have an account, you can access transaction history.`,
        buttonText: 'Click here to access the EPPICARD website',
        buttonUrl: 'https://www.eppicard.com/',
      })
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiUseCard = async agent => {
  try {
    await agent.add(
      `The EPPICard is a Debit Card. You can present the card to make purchases. The purchase amount will automatically be deducted from your card account. You may ask for "cash back" when making a purchase.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiWithdrawCash = async agent => {
  try {
    await agent.add(
      `You are allowed a total of three (3) free ATM cash withdrawals each calendar month at "in-network" ATMs. Each month you are allowed unlimited cash withdrawals at MasterCard member bank teller windows.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiSurcharge = async agent => {
  try {
    await agent.add(
      `The easisest way to avoid surcharges is to use "In-network" banks. "In-network" is defined as Hancock Bank, Regions Bank, or Trustmark Bank ATM locations. Each month you are allowed unlimited cash withdrawals at MasterCard member Bank teller windows. Bank ATMs outside of these "in-network" bank ATMs may apply a surcharge. Always read ATM messages carefully to determine if a bank ATM is applying fees to the transaction.`
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiLearnMore = async agent => {
  try {
    await agent.add(
      new Card({
        title: `Click the link to access the EPPICard website`,
        buttonText: 'EPPICard website',
        buttonUrl: 'https://www.eppicard.com/',
      })
    )
  } catch (err) {
    console.log(err)
  }
}

exports.eppiBalanceDenial = async agent => {
  try {
    await agent.add(
      `A denial is when you request more money than is currently available in your card account, or when you try to make a purchase that exceeds the money currently available in your card account.`
    )
    await agent.add(
      `You are allowed a total of three (3) free denials each calendar month for insufficient funds at "in-network" bank ATM locations. Denials are assessed a fee of $0.50 each after this. Denials from banks not "in-network" are assessed a fee of $0.50.`
    )
  } catch (err) {
    console.log(err)
  }
}
