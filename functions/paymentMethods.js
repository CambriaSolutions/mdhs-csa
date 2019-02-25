const { Suggestion, Card } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')

exports.pmtMethodsRoot = async agent => {
  try {
    await agent.add(
      `I can help help with determining payment options. Which of the following roles applies to you?`
    )
    await agent.add(new Suggestion('Custodial Parent'))
    await agent.add(new Suggestion('Non-Custodial Parent'))
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('None of These'))
    await agent.context.set({
      name: 'waiting-pmtMethods-custodial',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-nonCustodial',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-employer',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-none',
      lifespan: 2
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCustodial = async agent => {
  try {
    await agent.add(`Payments for custodial parents go through EPPICard.`)
    await agent.add(
      `Visit their website here [url] for call their support line at 1-866-461-4095.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsNonCustodial = async agent => {
  try {
    await agent.add(
      `Non-custodial parents have a variety of methods to make payments. Talk to your employer about a payrol deduction, or select one of the following to learn more.`
    )
    await agent.add(new Suggestion('Check or Money Order'))
    await agent.add(new Suggestion('Cash'))
    await agent.add(new Suggestion('eCheck/Bank Account Debit'))
    await agent.add(new Suggestion('Moneygram'))
    await agent.context.set({
      name: 'waiting-pmtMethods-checkOrMoneyOrder',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-cash',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-eCheckDebit',
      lifespan: 2
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-moneygram',
      lifespan: 2
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsEmployer = async agent => {
  try {
    await agent.add(
      `You can manage child support payments through iPayOnline. Click the link below to get started.`
    )
    await agent.add(
      new Card({
        title: 'iPayOnline',
        buttonText: 'Click here',
        buttonUrl: 'https://ipayonline.mssdu.net/iPayOnline/'
      })
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsNone = async agent => {
  try {
    await agent.add(
      `Sorry, I can only help with employers, custodial and non-custodial parents. 
      Please call [number] for assistance.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCheckOrMoneyOrder = async agent => {
  try {
    await agent.add(
      `Please mail to: MDHS/SDU, P.O. Box 23094, Jackson, MS 39225`
    )
    await agent.add(
      `Make sure to include your Social Security Number AND Case Number `
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCash = async agent => {
  try {
    await agent.add(
      `You can pay MDHS Child Support with cash with PayNearMe. Click below to find the nearest location to you.`
    )
    await agent.add(
      new Card({
        title: 'PayNearMe',
        buttonText: 'Click here',
        buttonUrl: 'http://paynearme.com/mississippi'
      })
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsEcheckDebit = async agent => {
  try {
    await agent.add(
      `You can make payments online using Mississippi iPayOnline. Click the link below to get started.`
    )
    await agent.add(
      new Card({
        title: 'iPayOnline',
        buttonText: 'Click here',
        buttonUrl: 'https://ipayonline.mssdu.net/iPayOnline/'
      })
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsMoneygram = async agent => {
  try {
    await agent.add(
      `All locations accept cash, and some locations accept pin-based cards. Click the link below to get started.`
    )
    await agent.add(
      new Card({
        title: 'MoneyGram',
        buttonText: 'Click here',
        buttonUrl: 'www.MoneyGram.com/BillPayLocations'
      })
    )
    await agent.add(
      `If you have questions about MoneyGram, click the link below for the Quick Reference Guide.`
    )
    await agent.add(
      new Card({
        title: 'Quick Reference Guide',
        buttonText: 'Click here',
        buttonUrl:
          'http://www.mdhs.ms.gov/wp-content/uploads/2018/12/MoneyGram-Quick-Reference.pdf'
      })
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}
