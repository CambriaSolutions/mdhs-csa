const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { supportInquiries } = require('./support.js')
/**
 * Intent: enforcement-
 *
 * @param {*} agent
 */
exports.enforcementRoot = async agent => {
  try {
    await agent.add(
      `MDHS has multiple enforcement tools to enforce child support orders. Click on one of the suggestions below to learn more.`
    )
    await agent.add(new Suggestion('License Suspension/Reinstatement'))
    await agent.add(new Suggestion('Tax Offset'))
    await agent.add(new Suggestion('Liens'))
    await agent.add(new Suggestion('Settlements'))
    await agent.add(new Suggestion('Passport Revocation'))
    await agent.add(new Suggestion('Credit Bureau Reporting'))
    await agent.add(new Suggestion('Unemployment Benefits'))
    await agent.add(new Suggestion('Bankruptcy'))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-license-suspension-and-reinstatement
 * Training phrases: { "Can I get license revoked?", "Why was my license revoked?", "How can I get my license reinstated?" }
 *
 * @param {*} agent
 */
exports.enforcementLicenseSuspensionReinstatement = async agent => {
  try {
    await agent.add(
      `MDHS may suspend driver's licenses and professional licenses to enforce child support when arrears are owed.`
    )
    await agent.add(
      'Would you like to learn more about when a license may be suspended or how to get a suspended license reinstated?'
    )
    await agent.add(new Suggestion('License Suspension'))
    await agent.add(new Suggestion('License Reinstatement'))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-license-suspension
 * Training phrases: { "License Suspension" }
 *
 * @param {*} agent
 */
exports.enforcementLicenseSuspension = async agent => {
  try {
    await agent.add(
      'Generally, after 30 days of non-payment a license suspension notice will automatically be sent to the parent who owes support. The parent who owes support has 90 days to become current or enter into a payment arrangement to avoid suspension. If the parent who owes support does not comply, the license is subject to suspension.'
    )
    await agent.add(
      'If the parent who owes support previously entered into a court-approved payment arrangement and fails to make payments in accordance with that arrangement, a notice is not required and the 90 days does not apply. The license is subject to immediate suspension.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-license-suspension-repeat-two
 * Training phrases: { "What if their license has been suspended before for non-payment?" }
 *
 * @param {*} agent
 */
exports.enforcementLicenseSuspensionNonCompliance = async agent => {
  try {
    await agent.add(
      'Generally, after 30 days of non-payment a license suspension notice will automatically be sent to the parent who owes support. The parent who owes support has 90 days to become current or enter into a payment arrangement to avoid suspension. If the parent who owes support does not comply, the license is subject to suspension.'
    )
    await agent.add(
      'If the parent who owes support previously entered into a court-approved payment arrangement and fails to make payments in accordance with that arrangement, a notice is not required and the 90 days does not apply. The license is subject to immediate suspension.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-license-reinstatement
 * Training phrases: { "License Reinstatement" }
 *
 * @param {*} agent
 */
exports.enforcementLicenseReinstatement = async agent => {
  try {
    await agent.add(
      'To reinstate a suspended license, the parent who owes support either has to become current on support owed, or enter into a payment agreement with MDHS.'
    )
    await agent.add(new Suggestion(`Submit Inquiry for Reinstatement`))
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-tax-offset
 * Training phrases: { " Taxes " }
 *
 * @param {*} agent
 */
exports.enforcementTaxOffset = async agent => {
  try {
    await agent.add(
      'Generally, if a parent has been certified for tax offset, a portion of the taxes may be offset unless there is a joint tax return filed. If a joint tax return is filed, it may take up to 6 months for any federal (IRS) offset payment to be applied. State Tax Collections are distributed after a 30 day hold period.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
/**
 * Intent: enforcement-liens
 * Training phrases: { "Liens", "Bank Accounts", etc }
 *
 * @param {*} agent
 */
exports.enforcementLiens = async agent => {
  try {
    await agent.add(
      'Funds in financial accounts may be seized for past due child support. Generally, MDHS receives this information through various sources and sends notice of lien to the bank, court, and the parent who owes support.'
    )
    await agent.add(new Suggestion('Contest an existing Lien'))
    await agent.add(
      new Suggestion('Provide information on a financial account')
    )
  } catch (err) {
    console.error(err)
  }
}
/**
 * Intent: enforcement-contest-lien
 * Training phrases: { "Contest an existing Lien " }
 *
 * @param {*} agent
 */
exports.enforcementContestLien = async agent => {
  try {
    await agent.add(
      `Funds are held at the financial institution for 45 days to allow the account holder(s) to contest the lien by alleging mistaken identity or fact in regards to the child support account. Please submit a request or call <a href="tel:+18778824916">1-877-882-4916</a> to contest the lien.`
    )
    await agent.add(new Suggestion('Submit Request'))
    await handleEndConversation(agent)
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-financial-account-update-case
 * Training phrases: { "Provide information on a financial account" }
 *
 * @param {*} agent
 */
exports.enforcementFinancialAccountUpdateCase = async agent => {
  try {
    await agent.add(
      `If you have information about the financial accounts of the parent who owes support, please call <a href="tel:+18778824916">1-877-882-4916</a> to update your case.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-personal-injury
 * Training phrases: { "Settlements", "Personal injury", "Workman's comp" }
 *
 * @param {*} agent
 */
exports.enforcementPersonalInjury = async agent => {
  try {
    await agent.add(
      "MDHS may offset personal injury or workers' compensation settlements. MDHS receives information about the settlements from various sources and works to negotiate payment settlements."
    )
    await agent.add(
      "Do you have information about a workers' compensation or personal injury settlement?"
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-enforcement-settlements-update-case',
      lifespan: 1,
    })
    await agent.context.set({
      name: 'waiting-enforcement-settlements-no-update-case',
      lifespan: 1,
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-settlements-update-case
 * Training phrases: { "Update case settlements"}
 *
 * @param {*} agent
 */
exports.enforcementSettlementsUpdateCase = async agent => {
  try {
    await agent.add(
      `If you have information about settlements that the parent who owes support may receive, please click below to update your case.`
    )
    await agent.add(new Suggestion(`Update Case`))
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-passport-revocation
 * Training phrases: { "Passport revoked" }
 *
 * @param {*} agent
 */
exports.enforcementPassportRevocation = async agent => {
  try {
    await agent.add(
      'If the parent who owes support owes more than $2,500 in child support, an automatic notification is sent to the federal government to prevent the issuance or renewal of a passport.'
    )
    await agent.add(new Suggestion('How do I get my passport reinstated?'))
  } catch (err) {
    console.error(err)
  }
}
/**
 * Intent: enforcement-passport-reinstatement
 * Training phrases: { "How do I get my passport reinstated?" }
 *
 * @param {*} agent
 */
exports.enforcementPassportReinstatement = async agent => {
  try {
    await agent.add(
      'A passport may be reinstated when the amount of support owed is less than $2,500. In very limited circumstances, MDHS has discretion to negotiate with the parent who owes support to remove the passport hold.'
    )

    // The client has not requested this suggestion, but it makes sense to include
    await agent.add(new Suggestion(`Submit Inquiry`))
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
/**
 * Intent: enforcement-credit-bureau-reporting
 * Training phrases: { "Credit Bureau Reporting Credit Score" }
 *
 * @param {*} agent
 */
exports.enforcementCreditBureauReporting = async agent => {
  try {
    await agent.add(
      'MDHS automatically sends notice to the major credit bureaus when the parent who owes support is delinquent more than 60 days.'
    )
    await agent.add(new Suggestion('What if this was done in error?'))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-unemployment
 * Train phrases: { "How will my unemployment benefits be impacted?" }
 *
 * @param {*} agent
 */
exports.enforcementUnemployment = async agent => {
  try {
    await agent.add(
      'MDHS partners with the MS Dept. of Employment Security to withhold child support payments from unemployment benefits.'
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.enforcementSettlementsNoUpdateCase = async agent => {
  try {
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-report-error
 * Training phrases: { "What if this was done in error?" }
 *
 * @param {*} agent
 */
exports.enforcementReportError = async agent => {
  try {
    await agent.add(
      'The parent who owes support may dispute the DHS claim with the credit bureaus or request MDHS to review their case if they believe the report was made in error. To have your case reviewed, click "Submit Inquiry for Review" below.'
    )
    await agent.add(new Suggestion(`Submit Inquiry for Review`))
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.enforcementSubmitInquiry = async agent => {
  try {
    await supportInquiries(agent)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: bankruptcy-support
 *
 * @param {*} agent
 */
exports.enforcementBankruptcy = async agent => {
  try {
    await agent.add(
      `If a parent who owes Child Support files for Chapter 13 bankruptcy, MDHS can file a claim with the bankruptcy court and seek to have the support in the bankruptcy payment.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
