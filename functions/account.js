const { handleEndConversation, tbd } = require('./globalFunctions.js')

exports.accountBalance = async agent => {
  try {
    await agent.add(
      'To avoid fees, you may check the account balance of your debit card/EPPIcard online by visiting <a href="http://www.eppicard.com" target="_blank">www.eppicard.com</a> and creating an account. You may also check the balance on your debit card/EPPIcard 24 hours a day, 7 days a week by calling customer service at <a href="tel:+18664614095">1-866-461-4095</a>. Please note that fees may apply when calling customer service.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.accountInformation = async agent => {
  try {
    await tbd(agent)
  } catch (err) {
    console.log(err)
  }
}