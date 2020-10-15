const Logger = require('../../utils/Logger')
const logger = new Logger('EPPI Card')

exports.eppiFees = async agent => {
  try {
    const { Card } = require('dialogflow-fulfillment')
    const { handleEndConversation } = require('../globalFunctions')

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
    console.error(err.message, err)
  }
}