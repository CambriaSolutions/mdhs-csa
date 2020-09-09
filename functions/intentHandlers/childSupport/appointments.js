const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('../globalFunctions')
const { mapRoot } = require('../common/map.js')

exports.apptsYesContacted = async agent => {
  try {
    await agent.add(
      'Plan to appear at the office listed in your notice letter during the specified time frame.'
    )
    await agent.add(
      'Failure to appear in accordance with notice instructions may result in your case being closed and your public assistance benefits may be sanctioned.'
    )
    await agent.add(
      'If you have urgent questions, or cannot appear during the allotted time, you can contact support at <a href="tel:+18778824916">1-877-882-4916</a>.'
    )

    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.apptsOfficeLocationsHandoff = async agent => {
  try {
    const wantsLocation = agent.parameters.wantsLocation
    if (wantsLocation === 'yes') {
      await mapRoot('cse')(agent)
    } else {
      await handleEndConversation(agent)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.apptsQAMissedAppt = async agent => {
  try {
    await agent.context.set({
      name: 'waiting-appts-yes-contacted',
      lifespan: 2,
    })
    this.apptsYesContacted(agent)
  } catch (err) {
    console.error(err)
  }
}
