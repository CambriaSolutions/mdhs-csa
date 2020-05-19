const { handleEndConversation } = require('../globalFunctions.js')

exports.supportQACpPictureId = async agent => {
  try {
    await agent.add(`Yes, anyone applying for services requires a picture ID.`)
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.supportQAWhoCanApply = async agent => {
  try {
    await agent.add(`Any legal custodians can apply for child support.`)
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.supportQAOtherState = async agent => {
  try {
    await agent.add(
      `Yes, we will provide child support services regardless in what state the other parent resides.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.supportQANcpPrison = async agent => {
  try {
    await agent.add(
      `If an individual is to be incarcerated for more than 180 days, they will receive a notice of their right to request a review and modification of their order. If a request is received, the agency will review and make a determination based on the NCP's ability to pay.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
