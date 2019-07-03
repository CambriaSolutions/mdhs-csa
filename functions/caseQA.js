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
      `I cannot provide you case specific information at this time. You may submit an support request or call <a href="tel:+18778824916">877-882-4916</a>.`
    )
    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion(`Home`))
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
