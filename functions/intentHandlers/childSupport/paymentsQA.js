const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('../globalFunctions')
const {
  supportInquiries,
  supportReviewPayments,
  supportEmploymentStatus,
} = require('./support.js')

// TODO ----- VERY IMPORTANT
// THIS INTENT HANDLER SEEMS TO BE USED FOR AN INTENT THAT CAN ONLY BE REACHED WITH TRAINING PHRASES. NO BUTTONS. 
// ALSO, THE CONTENT IN THIS HANDLER IS NOWHERE TO BE FOUND IN LUCIDCHART. NEED TO REVIEW. 
exports.pmtQAHaventReceived = async agent => {
  try {
    await agent.add(
      'Parents who pay support have the full month to pay.  If you would like more information, then please call <a href="tel:+18778824916">1-877-882-4916</a>.'
    )
    await agent.add(
      'Do you have any other questions?'
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Submit Feedback'))

    await agent.context.set({
      name: 'waiting-feedback-root',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-pmtQA-havent-received-submit-request',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.pmtQAHaventReceivedSubmitRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQAPaymentReduction = async agent => {
  try {
    await agent.add(
      'I can help you submit a request to have your case reviewed to see if a modification is appropriate. Please note that this can modify your payments upwards or downwards. Would you like to continue?'
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
      'If you owe back child support, you still have to pay that support. There are other special circumstances that may also require continued payments. If you would like more information, I can help you submit a support request.'
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-inquiry',
      lifespan: 1
    })
    await agent.context.set({
      name: 'waiting-restart-conversation',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQAEmployerPaymentStatus = async agent => {
  try {
    await agent.add('Have you reported your employer to CSE?')
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))

    await agent.context.set({
      name: 'waiting-pmtqa-yes-employer-payment-status',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQAYesEmployerPaymentStatus = async agent => {
  try {
    const reportCSE = agent.parameters.reportCSE

    if (reportCSE === 'yes') {
      await supportInquiries(agent)
    } else {
      await agent.context.set({
        name: 'ticketinfo',
        lifespan: 100,
        parameters: {
          supportType: 'Change of Employment Status',
          employmentChangeType: 'Change Or Add Employer',
        },
      })
      await supportEmploymentStatus(agent)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.pmtQANCPPaymentStatus = async agent => {
  try {
    await agent.add('Click <a href="https://www.eppicard.com/" target="_blank">here</a> to check your EPPI card statement.')
    await agent.add('At this time, I cannot answer this question. However, I can help you get the answer to this question through submitting a support ticket.')

    await agent.add(new Suggestion('Submit Support Request'))

    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-inquiry',
      lifespan: 1
    })
    await agent.context.set({
      name: 'waiting-restart-conversation',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}
