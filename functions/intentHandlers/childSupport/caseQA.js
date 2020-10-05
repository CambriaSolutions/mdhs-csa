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
