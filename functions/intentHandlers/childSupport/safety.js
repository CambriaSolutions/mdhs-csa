const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('../globalFunctions')

exports.safety = async agent => {
  try {
    await agent.add(
      'MDHS takes safety of families very seriously and can modify some processes to help with safety concerns. Reporting your safety concerns is not a criminal allegation against any party in a case, nor a request for MDHS to avoid pursuing services. Instead, this information is used by MDHS to better manage your case and protect your information. MDHS treats this information as confidential, and will not reveal it to any other party, including another parent.'
    )

    await agent.add(
      'If you are applying for child support services or have been referred by another program, please let us know as soon as possible if any of these conditions apply to your family: \
      <ul>\
        <li>You are concerned about the other parent’s reaction to child support services.</li>\
        <li>There is a restraining order against the other parent.</li>\
        <li>You are concerned of the other parent getting your address and contact information.</li>\
        <li>You are afraid about the other parent.</li>\
        <li>You are afraid of seeing the other parent in court or child support office.</li>\
        <li>The other parent has been convicted of domestic violence or another related crime such as assault, battery, stalking, etc.</li>\
      </ul>'
    )

    await agent.add(
      'If any of the above circumstances apply to your family and you have an existing case or have been referred to child support by another program, please contact us immediately at 1-877-882-4916 or report the information by submitting a request below.'
    )

    await agent.add(
      'If you are considering opening a case, please let us know on the application if these issues apply to your family.'
    )

    await agent.add(new Suggestion('Submit Support Request'))
    await agent.add(new Suggestion('Parent\'s Guide to CSE'))

    await handleEndConversation(agent)

    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-safety',
      lifespan: 1
    })
  } catch (err) {
    console.error(err)
  }
}