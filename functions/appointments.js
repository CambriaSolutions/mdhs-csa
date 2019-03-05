const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')

exports.apptsRoot = async agent => {
  try {
    await agent.add(
      'Sure, I can provide you with information about appointments. What are you looking to do?'
    )
    await agent.add(new Suggestion('Appointment Guidelines'))
    await agent.add(new Suggestion('Schedule an Appointment'))
    await agent.add(new Suggestion('Office Locations'))
    await agent.context.set({
      name: 'waiting-appts-guidelines',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-appts-schedule',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-appts-office-locations',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.apptsSchedule = async agent => {
  try {
    await agent.add(
      'Have you been contacted by a Child Support office, or asked to appear at a Child Support office?'
    )
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-appts-yes-contacted',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-appts-not-contacted',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.apptsYesContacted = async agent => {
  try {
    await agent.add(`Plan to appear at the office listed in your summons.`)
    await agent.add(
      `If you have urgent questions, you can contact support at 1-877-882-4916.`
    )

    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.apptsNoContacted = async agent => {
  try {
    await agent.add(
      `You generally aren't required to schedule an appointment on your own. If you need to visit us, you will receive a notice to appear at a District office.`
    )
    await agent.add(
      `If you have urgent questions, you can contact support at 1-877-882-4916.`
    )

    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.apptsOfficeLocations = async agent => {
  try {
    await agent.add(
      `Sorry, I'm still getting trained on locating offices, check back soon!`
    )
    await agent.add(`Can I help you with some of the things I know?`)
    await agent.add(new Suggestion('Appointments'))
    await agent.add(new Suggestion('Payments'))
    await agent.add(new Suggestion('Complaints'))
  } catch (err) {
    console.log(err)
  }
}

exports.apptsGuidelines = async agent => {
  try {
    await agent.add(
      `You generally aren't required to schedule an appointment on your own. If you need to visit us, you will receive a notice to appear at a District office.`
    )
    await agent.add(
      `If you have urgent questions, you can contact support at 1-877-882-4916.`
    )

    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}
