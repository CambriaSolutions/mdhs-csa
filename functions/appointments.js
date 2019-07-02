const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')
const { mapRoot } = require('./map.js')

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
    await agent.add(
      `Plan to appear at the office listed in your notice letter during the specified time frame.`
    )
    await agent.add(
      `Failure to appear in accordance with notice instructions may result in your case being closed and your public assistance benefits may be sanctioned.`
    )
    await agent.add(
      `If you have urgent questions, or cannot appear during the allotted time, you can contact support at <a href="tel:+18778824916">1-877-882-4916</a>.`
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
      `You generally aren't required to schedule an appointment on your own.<br/><br/>If we require an appointment, you will receive a notice letter to appear at a District office.`
    )

    await agent.add(
      `If you have urgent questions, you can contact support at <a href="tel:+18778824916">1-877-882-4916</a>.<br/><br/>You may visit any office between 8:00 am and 5:00 pm, Monday through Friday, excluding holidays, to obtain information about your case.`
    )
    await agent.add('Do you need help finding an office location?')
    await agent.add(new Suggestion('Yes'))
    await agent.add(new Suggestion('No'))
    await agent.context.set({
      name: 'waiting-appts-office-locations-handoff',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.apptsOfficeLocationsHandoff = async agent => {
  try {
    const wantsLocation = agent.parameters.wantsLocation
    if (wantsLocation === 'yes') {
      await mapRoot(agent)
    } else {
      await handleEndConversation(agent)
    }
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
      `If you have urgent questions, you can contact support at <a href="tel:+18778824916">1-877-882-4916</a>.`
    )

    // Ask the user if they need anything else, set appropriate contexts
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.apptsQAOfficeHours = async agent => {
  try {
    await agent.context.set({
      name: 'waiting-appts-not-contacted',
      lifespan: 2,
    })
    this.apptsNoContacted(agent)
  } catch (err) {
    console.error(err)
  }
}
