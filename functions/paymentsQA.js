const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { supportInquiries, supportReviewPayments } = require('./support.js')

exports.pmtQAHaventReceived = async agent => {
  try {
    await agent.add(
      `Parents who pay support have the full month to pay.  If you would like more information, then please call <a href="tel:+18778824916">1-877-882-4916</a>.`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.pmtQAPaymentReduction = async agent => {
  try {
    await agent.add(
      `I can help you submit a request to have your case reviewed to see if a modification is appropriate. Please note that this can modify your payments upwards or downwards. Would you like to continue?`
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))

    await agent.context.set({
      name: 'waiting-pmtQA-yes-payment-reduction',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.pmtQAYesPaymentReduction = async agent => {
  try {
    const continuePaymentReduction = agent.parameters.continuePaymentReduction
    if (continuePaymentReduction === 'yes') {
      await supportReviewPayments(agent)
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQAOver21 = async agent => {
  try {
    await agent.add(
      `If you owe back child support, you still have to pay that support. There are other special circumstances that may also require continued payments. If you would like more information, I can help you submit a support request.`
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion(`Home`))
    await agent.context.set({
      name: 'waiting-pmtQA-over-21-submit-request',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-restart-conversation',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQAOver21SubmitRequest = async agent => {
  try {
    await agent.context.set({
      name: 'ticketinfo',
      lifespan: 100,
      parameters: { supportType: 'inquiry' },
    })
    await supportInquiries(agent)
  } catch (err) {
    console.log(err)
  }
}
