const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { iwoRoot } = require('./incomeWithholding.js')

exports.employerRoot = async agent => {
  try {
    await agent.add(`What can I help you with?`)
    await agent.add(new Suggestion('EFT'))
    await agent.add(new Suggestion('iPayOnline'))
    await agent.add(new Suggestion('Checks/Money Orders'))
    await agent.add(new Suggestion('Income Witholding Order Information'))
  } catch (err) {
    console.error(err)
  }
}

exports.employerEFT = async agent => {
  try {
    await agent.add(
      `Employers can make payments electronically through EFT payments.`
    )
    await agent.add(
      `For information on how to enroll, you can call <a href="tel:+1-769-777-6111">1-769-777-6111</a> or by emailing <a href="mailto:MSSDUOutreach@informatixinc.com">MSSDUOutreach@informatixinc.com</a>`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerIPayOnline = async agent => {
  try {
    await agent.add(
      `You can manage child support payments through iPayOnline.<a href="https://ipayonline.mssdu.net/iPayOnline/" target="_blank">Click here</a> to get started.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerChecksMoneyOrders = async agent => {
  try {
    await agent.add(
      `The employer may submit payments to the State Dispersement Unit per the Income Witholding Order. Submit payments to:
         MDHS/SDU
         PO Box 23094
         Jackson, MS 39225
        `
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerIWOHandoff = async agent => {
  try {
    await agent.add(
      `If you are an employer needing assistance with an Income Withholding Order, I can help you.`
    )
    await iwoRoot(agent)
  } catch (err) {
    console.error(err)
  }
}
