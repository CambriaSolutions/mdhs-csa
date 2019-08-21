const { Suggestion } = require('dialogflow-fulfillment')
const { supportInquiries } = require('./support.js')
/**
 * Intent: enforcement-
 *
 * @param {*} agent
 */
exports.enforcementRoot = async agent => {
  try {
    await agent.add(
      `MDHS has several enforcement tools to enforce child support orders.<br/>
      If you would like, I can give you information on enforcement actions regarding:
      <ul><li>License Suspension or Reinstatement</li>
        <li>Tax Offsets</li>
        <li>Liens</li>
        <li>Passport Revocation</li>
        <li>Credit Bureau Reporting</li>
        <li>Unemployment Benefits</li>
        <li>Personal Injury and Workman's Comp Injuries</li></ul>`
    )
    await agent.add(new Suggestion('License Suspension/Reinstatement'))
    await agent.add(new Suggestion('Tax Offset'))
    await agent.add(new Suggestion('Liens'))
    await agent.add(new Suggestion('Passport Revocation'))
    await agent.add(new Suggestion('Credit Bureau Reporting'))
    await agent.add(new Suggestion('Unemployment Benefits'))
    await agent.add(
      new Suggestion("Personal Injury and Workman's Comp Injuries")
    )
    await agent.context.set({
      name: 'waiting-enforcement-submit-inquiry',
      lifespan: 2,
    })
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
    await agent.add('License Suspension is one of the MDHS enforcement tools.')
    await agent.add(
      'Would you like to learn more about when a license will be suspended or how to get a suspended license reinstated?'
    )
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
exports.enforcementLicenseSuspensionTwo = async agent => {
  try {
    await agent.add(
      'If the parent who owes support previously entered into a payment arrangement and fails to make payments in accordance with that arrangement, a notice is not required and the 90 days does not apply. The license is subject to immediate suspension.'
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-license-reinstatement
 * Training phrases: { "License Reinstatement" }
 * TODO: Insert link for action request to reinstate license
 *
 * @param {*} agent
 */
exports.enforcementLicenseReinstatement = async agent => {
  try {
    await agent.add(
      'To reinstate a suspended license, the parent who owes support either has to become current on support owed, or enter into a payment agreement. <Insert link to license Reinstatement action request>'
    )
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
      'Tax Offset is one of the MDHS enforcement tools. What would you like to learn about Tax Offsets?'
    )
    await agent.add(new Suggestion('License Suspension'))
    await agent.add(new Suggestion('License Reinstatement'))
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
      'Funds and Financial accounts may be seized. Generally MDHS receives this information through various sources and sends notice of lien with the bank, court, and the parent who owes support.'
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
      'Funds are held at the institution for 45 days to allow the account holder(s) to contest the lien by alleging mistaken identity or fact on account of lien.'
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-financial-account-update-case
 * Training phrases: { "Provide information on a financial account" }
 * TODO: Insert link to 1-800 number
 *
 * @param {*} agent
 */
exports.enforcementFinancialAccountUpdateCase = async agent => {
  try {
    await agent.add(
      "If you have information about the parent who owes support's financial accounts, please call <p>Insert 1-800 number here.</p> to update your service."
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-personal-injury
 * Training phrases: { "Personal injury", "Workman's comp" }
 *
 * @param {*} agent
 */
exports.enforcementPersonalInjury = async agent => {
  try {
    await agent.add(
      "MDHS may offset personal injury or worker's compensation settlements. MDHS receives information about the settlements from various sources and works to negotiate payment settlements. "
    )
    await agent.add(
      new Suggestion(
        "Do you have information about a workman's comp or personal injury settlement?"
      )
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * Intent: enforcement-settlements-update-case
 * Training phrases: { "Update case settlements"}
 * TODO: Insert update case link
 *
 * @param {*} agent
 */
exports.enforcementSettlementsUpdateCase = async agent => {
  try {
    await agent.add(
      `If you have information about settlements that the parent who owes support may receive please click here <a>link tbd</a> to update your case.`
    )
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
      'If the parent who owes child support owes more than $2500 in child support, an automatic notification is sent to the federal government to prevent the issuance or renewal of a passport.'
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
      'MDHS has discretion when negotiating with a parent who owes support to have the passport hold removed.'
    )
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
 * Intent: enforcement-report-error
 * Training phrases: { "What if this was done in error?" }
 * TODO: Insert Generic Support Ticket link
 *
 * @param {*} agent
 */
exports.enforcementReportError = async agent => {
  try {
    await agent.add(
      'The parent who owes support may dispute the DHS claim with the credit bureaus or request MDHS to review their case if they believe the report was made in error. To have the your case reviewed click here <Generic Support Ticket>.'
    )
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
