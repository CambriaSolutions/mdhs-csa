const Logger = require('../../utils/Logger')
const logger = new Logger('Case QA')

const {
  supportReviewPayments,
  supportInquiries,
  supportType,
} = require('./support.js')

exports.caseQAIncreaseReview = async agent => {
  try {
    await supportReviewPayments(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.caseQAGeneralSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.caseQAChangePersonalInfo = async agent => {
  try {
    await supportType(agent, 'change personal information')
  } catch (err) {
    logger.error(err.message, err)
  }
}

exports.caseQAComplianceSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    logger.error(err.message, err)
  }
}
