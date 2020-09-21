const { Card } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('../globalFunctions')

exports.eppiFees = async agent => {
  try {
    await agent.add(
      new Card({
        title: 'ATM Withdrawals "in-network"',
        text: `
        Total of three (3) free each calendar month; $1.75 each for any additional.
       `,
      })
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}