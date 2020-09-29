const {
  supportReviewPayments,
  supportInquiries,
  supportType,
} = require('./support.js')

exports.caseQAIncreaseReview = async agent => {
  try {
    await supportReviewPayments(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.caseQAGeneral = async agent => {
  try {
    const { Suggestion } = require('dialogflow-fulfillment')

    await agent.add(
      'I cannot provide you case specific information at this time. You may submit a support request or call <a href="tel:+18778824916">877-882-4916</a>.'
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
    console.error(err)
  }
}

exports.caseQAGeneralSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.caseQAChangePersonalInfo = async agent => {
  try {
    await supportType(agent, 'change personal information')
  } catch (err) {
    console.error(err)
  }
}

exports.caseQAComplianceSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err)
  }
}
