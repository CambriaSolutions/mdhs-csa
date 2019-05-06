const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { supportInqueries, supportChildSupportType } = require('./support.js')

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
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-nonCustodial',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-employer',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtMethods-none',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCustodial = async agent => {
  try {
    await agent.add(
      `Payments for custodial parents go through EPPICard. <a href="https://www.eppicard.com/" target="_blank">Click here</a> to access the EPPICard website or or call their support line at <a href="tel:+18664614095">1-866-461-4095</a>.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsNonCustodial = async agent => {
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

exports.pmtMethodsEmployer = async agent => {
  try {
    await agent.add(
      `You can manage child support payments through iPayOnline. <a href="https://ipayonline.mssdu.net/iPayOnline/" target="_blank">Click here</a> to get started.`
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
      Please call <a href="tel:+18778824916">1-877-882-4916</a> for assistance.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCheckOrMoneyOrder = async agent => {
  try {
    await agent.add(
      `Please mail to:  
      MDHS/SDU  
      P.O. Box 23094  
      Jackson, MS 39225  `
    )
    await agent.add(
      `Make sure to include your Social Security Number AND Case Number.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCash = async agent => {
  try {
    await agent.add(new Suggestion('MoneyGram'))
    await agent.add(new Suggestion('PayNearMe'))

    await agent.context.set({
      name: 'waiting-pmtMethods-paynearme',
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

exports.pmtMethodsPayNearMe = async agent => {
  try {
    await agent.add(
      `You can pay MDHS Child Support with cash at PayNearMe locations. A small fee applies.<br/><br/>PayNearMe is available at CVS/Pharmacy, Family Dollar, Fidelity Express, ACE Cash Express and 7-Eleven.<br/><br/>Payments may take 3 to 4 banking days to be posted to your child support account.<br/><br/><a href="http://paynearme.com/mississippi" target="_blank">Click here</a> to find the nearest location to you.<br/><br/><a href="http://www.mdhs.ms.gov/wp-content/uploads/2018/01/Mississippi-Child-Support-MDHS-FAQ.pdf" target="_blank">Click here</a> for frequently asked questions.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsEcheckDebit = async agent => {
  try {
    await agent.add(
      `You can make payments online using Mississippi iPayOnline. <a href="https://ipayonline.mssdu.net/iPayOnline/" target="_blank">Click here</a> to get started.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsMoneygram = async agent => {
  try {
    await agent.add(
      `You can pay MDHS Child Support with cash at MoneyGram locations. Fees apply.<br/><br/>Some locations also accept PIN based debit card payments.<br/><br/>MoneyGram is available at Walmart, Kroger, CVS/Pharmacy, and Advance America locations.<br/><br/>Payment may take 2-3 business days to be posted to your child support account.<br/><br/><a href="http://www.MoneyGram.com/BillPayLocations" target="_blank">Click here</a> to find the nearest location to you.<br/><br/><a href="http://www.mdhs.ms.gov/wp-content/uploads/2018/12/MoneyGram-Quick-Reference.pdf" target="_blank">Click here</a> for frequently asked questions.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCantMake = async agent => {
  try {
    await agent.add(
      `Has any of the following occurred? Change in employment status, recently incarcerated, income is less, lost a job, been injured?`
    )
    await agent.context.set({
      name: 'waiting-pmtMethods-cant-make-qualifying',
      lifespan: 1,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCantMakeQualifying = async agent => {
  try {
    const needsHelp = agent.parameters.needsHelp
    if (needsHelp === 'yes') {
      await agent.add(
        `Would you like to submit a request for your child support amount to be reviewed?`
      )
      await agent.context.set({
        name: 'waiting-pmtMethods-cant-make-qualifying-help',
        lifespan: 2,
      })
    } else {
      await supportInqueries(agent)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.pmtMethodsCantMakeQualifyingHelp = async agent => {
  try {
    const needsHelp = agent.parameters.needsHelp
    if (needsHelp === 'yes') {
      await supportChildSupportType(agent)
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.log(err)
  }
}
