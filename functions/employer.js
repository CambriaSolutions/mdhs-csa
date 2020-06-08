const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { iwoRoot } = require('./incomeWithholding.js')

exports.employerRoot = async agent => {
  try {
    await agent.add(`What can I help you with?`)
    await agent.add(new Suggestion('EFT'))
    await agent.add(new Suggestion('iPayOnline'))
    // await agent.add(new Suggestion('Employer Guide'))
    await agent.add(new Suggestion('Checks/Money Orders'))
    await agent.add(new Suggestion('Income Withholding Order Information'))
    await agent.add(new Suggestion('Bills and Notices'))
  } catch (err) {
    console.error(err)
  }
}

exports.employerEFT = async agent => {
  try {
    await agent.add(
      `Employers can make payments electronically through EFT payments.`
    )
    await agent.add(
      `For information on how to enroll, you can call <a href="tel:+1-769-777-6111">1-769-777-6111</a> or by emailing <a href="mailto:MSSDUOutreach@informatixinc.com">MSSDUOutreach@informatixinc.com</a>`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerIPayOnline = async agent => {
  try {
    await agent.add(
      `You can manage child support payments through iPayOnline.<a href="https://ipayonline.mssdu.net/iPayOnline/" target="_blank">Click here</a> to get started.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerGuide = async agent => {
  try {
    await agent.add(
      `An Employer Guide was created to assist employers in learning more about topics such as reporting new hires, handling income withholding orders, or handling medical support notices. This guide provides resources, contact information, and links to forms.`
    )
    await agent.add(
      `Please <a href="http://www.mdhs.ms.gov/wp-content/uploads/2020/06/Reference-Guide-for-Employers-.pdf" target="_blank">click here</a> to open the Employer Guide for more information`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.employerChecksMoneyOrders = async agent => {
  try {
    await agent.add(
      `The employer may submit payments to the State Disbursement Unit per the Income Withholding Order. Submit payments to:
         MDHS/SDU
         PO Box 23094
         Jackson, MS 39225
        `
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.employerIWOHandoff = async agent => {
  try {
    await agent.add(
      `MDHS is required by law to submit Income Withholding Orders to employers to withhold child support and any arrears obligation.`
    )
    await agent.add(
      `Would you like to report employment information? If so, which of the following are you?`
    )
    await agent.add(new Suggestion('Employer'))
    await agent.add(new Suggestion('Parent Who Pays Support'))
    await agent.add(new Suggestion('Parent Who Receives Support'))
    await agent.context.set({
      name: 'waiting-iwo-root',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-support-parent-paying-employment-info',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-support-parent-receiving-employment-info',
      lifespan: 2,
    })
  } catch (err) {
    console.error(err)
  }
}

exports.employerBillsAndNotices = async agent => {
  try {
    await agent.add('If you are an employer who is receiving a monthly Child Support Income Withholding Bill for an employee, you may now view and print these documents online. These documents are available in Portable Document Format (PDF) only. If you have questions, please contact the Child Support Call Center <a href="tel:+18778824916">1-877-882-4916</a>')
    await agent.add('Please <a href="https://ccis.mdhs.ms.gov/" target="_blank">click here</a> to access the Child Support Billing Notice System')

    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}