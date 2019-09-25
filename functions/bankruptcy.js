const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { supportInquiries } = require('./support.js')
/**
 * Intent: bankruptcy-support
 *
 * @param {*} agent
 */
exports.bankruptcySupport = async agent => {
  try {
    await agent.add(
      `If a parent who owes Child Support files for Chapter 13 bankruptcy, MDHS can file a claim with the bankruptcy court and seek to have the support in the bankruptcy statements.`
    )
  } catch (err) {
    console.error(err)
  }
}
