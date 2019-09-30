const { Suggestion } = require('dialogflow-fulfillment')
const { handleEndConversation } = require('./globalFunctions.js')

exports.openCSCRoot = async agent => {
  await startCSCConvo(agent)
}

const startCSCConvo = async agent => {
  try {
    await agent.add(
      `Sure, I can help you with finding the type of service you desire. I can also help you with information, instructions and a link to the application to open a child support case.`
    )
    await agent.add(
      `The custodial parent, non-custodial parent or guardian may complete an application.`
    )
    await agent.add(
      `Which of the following services do you want assistance with?`
    )

    await agent.add(new Suggestion('Full Services'))
    await agent.add(new Suggestion('Location Services'))
    await agent.add(new Suggestion('Income Withholding Service Only'))

    await agent.context.set({
      name: 'waiting-open-csc-full-services',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-open-csc-location-services',
      lifespan: 2,
    })
    await agent.context.set({
      name: 'waiting-open-csc-employer-payments',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCFullServices = async agent => {
  try {
    await agent.add(
      `Full Services include: Locate the noncustodial parent; Establish the legal paternity of my child(ren); Get a legal order for child support, including medical insurance, for the child(ren), or get an amendment to the child support order if one already exists; Enforce the child support order by any way permitted by law; Collect and distribute child support payments according to Federal guidelines and the laws of the State of Mississippi; Disclose my circumstances in pleadings or other documents filed in a proceeding to enforce/determine child support for my child(ren).`
    )
    await agent.add(
      `Please note, if you desire Child Support services, you will need to pay $25.00. Include this when you complete and submit the application.`
    )
    await agent.add(
      `Note, in some cases, there may also be a mandatory $35.00 annual fee.`
    )
    await agent.add(`Is this the service you want?`)

    await agent.add(new Suggestion('Yes'))

    await agent.add(new Suggestion('No'))

    await agent.context.set({
      name: 'waiting-open-csc-select-form',
      lifespan: 2,
    })

    await agent.context.set({
      name: 'waiting-open-csc-no-service',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCSelectForm = async agent => {
  try {
    await agent.add(
      `Click <a href="http://www.mdhs.ms.gov/wp-content/uploads/2018/11/CSE_675-Application-11-2-18.pdf" target="_blank">here</a> to access the Child Support Service Application form. The form will open in a web browser and you can print it off from there.`
    )
    await handleEndConversation(agent)
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCLocationServices = async agent => {
  try {
    await agent.add(
      `MDHS works to find the parent responsible for paying child support. There is no fee associated with this service.`
    )
    await agent.add(`Is this the service you want?`)

    await agent.add(new Suggestion('Yes'))

    await agent.add(new Suggestion('No'))

    await agent.context.set({
      name: 'waiting-open-csc-select-form',
      lifespan: 2,
    })

    await agent.context.set({
      name: 'waiting-open-csc-no-service',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCCollectionEmployer = async agent => {
  try {
    await agent.add(
      `For this service, MDHS does not provide any enforcement services in order to collect payments. You must already have a court order requiring income to be withheld. Federal and state law requires all income withholding payments to be paid to the state disbursement unit. There is no fee for this service.`
    )
    await agent.add(`Is this the service you want?`)

    await agent.add(new Suggestion('Yes'))

    await agent.add(new Suggestion('No'))

    await agent.context.set({
      name: 'waiting-open-csc-select-form',
      lifespan: 2,
    })

    await agent.context.set({
      name: 'waiting-open-csc-no-service',
      lifespan: 2,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.openCSCNoService = async agent => {
  try {
    await startCSCConvo(agent)
  } catch (err) {
    console.error(err)
  }
}
