import {
  supportReviewPayments,
  supportInquiries,
  supportType,
} from './support'

export const caseQAIncreaseReview = async agent => {
  try {
    await supportReviewPayments(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}

export const caseQAGeneralSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}

export const caseQAChangePersonalInfo = async agent => {
  try {
    await supportType(agent, 'change personal information')
  } catch (err) {
    console.error(err.message, err)
  }
}

export const caseQAComplianceSupportRequest = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}
