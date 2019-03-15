exports.handleEndConversation = async agent => {
  await agent.add(`Can I help you with anything else?`)
  await agent.context.set({
    name: 'waiting-end-conversation',
    lifespan: 2,
  })
  await agent.context.set({
    name: 'waiting-restart-conversation',
    lifespan: 2,
  })
}

exports.calculatePercentage = (isSupporting, inArrears) => {
  if (isSupporting && inArrears) {
    return 55
  } else if (isSupporting && !inArrears) {
    return 50
  } else if (!isSupporting && !inArrears) {
    return 60
  } else if (!isSupporting && inArrears) {
    return 65
  } else {
    throw new Error('Cannot calculate percentage.')
  }
}

exports.validateCaseNumber = caseNumber => {
  let validCaseNumber = true
  if (caseNumber.charAt(0) !== '6') {
    validCaseNumber = false
  }
  if (caseNumber.length !== 9) {
    validCaseNumber = false
  }
  if (caseNumber.charAt(0) === '6' && caseNumber.charAt(9).match(/[a-z]/g)) {
    validCaseNumber = true
  }
  return validCaseNumber
}
