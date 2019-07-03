const { handleEndConversation } = require('./globalFunctions.js')

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

exports.supportQACpGoodCauseClaim = async agent => {
  try {
    await agent.add(
      `Yes, good cause can be documented through the use of one of the following: Protective Order, Birth Certificate, medical or law enforcement records indicating the child was conceived as the result of incest or forcible rape, Court documents or other records that show legal proceedings for adoption are pending, A written statement from a public or licensed private social agency that the custodial parent is being assisted by the agency in resolving whether to keep the child or relinquish the child for adoption, Court, medical, criminal child protective services, social services, psychological or law enforcement records which indicate that the other parent might inflict physical or emotional harm on the child or custodial parent, Medical records or statements from a mental health professional regarding the emotional health of the child or custodial parent which indicate that cooperating with child support may result in emotional harm to the child or custodial parent.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.error(err)
  }
}
