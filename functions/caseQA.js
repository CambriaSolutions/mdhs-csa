const { supportReviewPayments } = require('./support.js')

exports.caseQAIncreaseReview = async agent => {
  try {
    await supportReviewPayments(agent)
  } catch (err) {
    console.error(err)
  }
}
