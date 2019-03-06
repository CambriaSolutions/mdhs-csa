const { Suggestion, Card } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')

exports.dirDepRoot = async agent => {
  try {
    await agent.add(
      `I can help you with finding the Authorization Agreement for Direct Deposit! What would you like to do?`
    )
    await agent.add(new Suggestion('Learn More'))
    await agent.add(new Suggestion('Go to Form'))
    await agent.context.set({
      name: 'waiting-dirDep-learn-more',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-confirm-form',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepConfirmForm = async agent => {
  try {
    await agent.add(
      `I want to help you make sure that you fill out the form correctly. Before proceeding, we recommend you get a little more informed about the Direct Deposit form. Would you like to do that?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No, take me to the form'))
    await agent.context.set({
      name: 'waiting-dirDep-learn-more',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-show-form',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepShowForm = async agent => {
  try {
    await agent.add(
      new Card({
        title: `Authorization Agreement for Direct Deposit`,
        text: `Here is the link to the direct deposit form.`,
        buttonText: 'Direct Deposit Form',
        buttonUrl:
          'http://www.mdhs.ms.gov/wp-content/uploads/2018/08/Direct-Deposit-Agreement-Form-687-5-2-18.pdf',
      })
    )
    await agent.add(
      `In the event you cannot or do not want to download the form, please contact customer service at 1-601-359-4500 and our Mail Room will send you a copy.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepLearnMore = async agent => {
  try {
    await agent.add(`Which would you like to do?`)
    await agent.add(new Suggestion('Start'))
    await agent.add(new Suggestion('Change'))
    await agent.add(new Suggestion('Stop/Terminate'))
    await agent.context.set({
      name: 'waiting-dirDep-start',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-change',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-stop',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepStart = async agent => {
  try {
    await agent.add(
      `If you do not currently have direct deposit set up, then be sure to check START at the top of the form.`
    )
    await agent.add(
      `What type of account do you want to set up a direct deposit for?`
    )
    await agent.add(new Suggestion('Checking'))
    await agent.add(new Suggestion('Savings'))
    await agent.context.set({
      name: 'waiting-dirDep-checking',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-savings',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepChange = async agent => {
  try {
    await agent.add(
      `If you already have a direct deposit set up on an account, and you want to change it to another account, then be sure to check Change at the top of the form.`
    )
    await agent.add(
      `What type of account do you want to set up a direct deposit for?`
    )
    await agent.add(new Suggestion('Checking'))
    await agent.add(new Suggestion('Savings'))
    await agent.context.set({
      name: 'waiting-dirDep-checking',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-savings',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepStop = async agent => {
  try {
    await agent.add(
      `If you have a direct deposit set up on an account, and you want to stop or terminate, then be sure to check Stop/Terminate at the top of the form.`
    )
    await agent.add(
      `What type of account do you want to set up a direct deposit for?`
    )
    await agent.add(new Suggestion('Checking'))
    await agent.add(new Suggestion('Savings'))
    await agent.context.set({
      name: 'waiting-dirDep-checking',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-savings',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepSavings = async agent => {
  try {
    await agent.add(
      `You must submit a current letter from your bank, savings and loan or credit union (on bank letterhead) which includes the name of the account holder and account and routing bank numbers with this agreement.`
    )
    await agent.add(
      `Make sure that the account and routing numbers are identifiable and clearly visible on the document to prevent processing delays. If the account and/or routing bank numbers are not identifiable, the authorization agreement will not be processed!`
    )
    await agent.add(
      `Finally, don't forget, you MUST send the form to the proper location! Send to MDHS Child Support Enforcement Direct Deposit Unit, PO Box 352, Jackson, MS 39205-0352.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepChecking = async agent => {
  try {
    await agent.add(
      `You must submit a preprinted voided blank check, deposit slip, or current letter from your bank (on bank letterhead) that includes your account and routing bank numbers with this agreement.`
    )
    await agent.add(
      `Make sure that the account and routing numbers are identifiable and clearly visible on the document to prevent processing delays. If the account and/or routing bank numbers are not identifiable, the authorization agreement will not be processed!`
    )
    await agent.add(
      `Finally, don't forget, you MUST send the form to the proper location! Send to MDHS Child Support Enforcement Direct Deposit Unit, PO Box 352, Jackson, MS 39205-0352.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepAccountTerm = async agent => {
  try {
    await agent.add(
      `Your Direct Deposit will remain in full force and effect until the agency, DCSE - Direct Deposit Unit has received written notice to terminate this authority and until DCSE and the Financial Institution have been afforded a reasonable time to act on it.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepTakeEffect = async agent => {
  try {
    await agent.add(
      `For either an initial direct deposit request or a change direct deposit request, it generally takes about 2 weeks or 14 calendar days from when a correctly completed authorization agreement is recieved by MDHS-DCSE Direct Deposit staff for processing to be complete.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepExtraFunds = async agent => {
  try {
    await agent.add(
      `By signing the Authorization Agreement for Direct Deposit, you have given DCSE permission to recover the money from future child support payments.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepPaymentClosedAccount = async agent => {
  try {
    await agent.add(
      `When the payment is returned or rejected by the financial institution, your payment will be reissued to an EPPICard.`
    )
    await agent.add(`Would you like to learn more about the EPPICard?`)
    await agent.add(new Suggestion('Learn More'))
    await agent.context.set({
      name: 'waiting-dirDep-learn-more-eppicard',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-dirDep-no-learn-more-eppicard',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.dirDepLearnMoreEppiCard = async agent => {
  try {
    await agent.add(
      `Sure, I can help with the following topics regarding your payment card.`
    )
    await agent.add(new Suggestion('Get EPPICard'))
    await agent.add(new Suggestion('Activate'))
    await agent.add(new Suggestion('Fees'))
    await agent.add(new Suggestion('Set Up Notifications'))
    await agent.add(new Suggestion('FAQ'))
    await agent.add(new Suggestion('Replace, Report Stolen, Lost or Fraud'))
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
    console.error(err)
  }
}

exports.dirDepNoLearnMoreEppiCard = async agent => {
  try {
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
