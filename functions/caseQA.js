const { Suggestion } = require('dialogflow-fulfillment')
const {
  supportReviewPayments,
  supportInquiries,
  supportChangePersonalInfo,
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
    await agent.add(
      `At this time, I am not able to answer specific questions about your case. I can help you submit service requests and prevent you from waiting on hold. To submit a request, please click below. To see our customer service number, please click “Customer Service”.`
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Customer Service'))
    await agent.context.set({
      name: 'waiting-caseQA-general-support-request',
      lifespan: 2,
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
    await supportChangePersonalInfo(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.caseQACompliance = async agent => {
  try {
    await agent.add(
      `You may submit an action request here, or call the support number at <a href="tel:+18778824916">877-882-4916</a>`
    )
    await agent.add(new Suggestion('Submit Action Request'))
    await agent.context.set({
      name: 'waiting-caseQA-compliance-support-request',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-restart-conversation',
      lifespan: 2,
    })
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
