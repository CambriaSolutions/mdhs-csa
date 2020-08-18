const { Suggestion } = require('dialogflow-fulfillment')

exports.interstateRoot = async agent => {
  try {
    await agent.add(
      'Sometimes, parents live in different states, or an order for support was established in Mississippi and then one or both parents have moved, or maybe an order was established in another state and one of the parents moved to Mississippi. Based on the unique facts and circumstances of your situation, Mississippi may be able to open a case and work with the other states involved to establish and/or enforce an order, or to provide information to the other state so that state may establish and/or enforce an order.'
    )
    await agent.add(
      'If you have an existing interstate case, have more questions about interstate cases, or have received information from Mississippi and your child support case is in another state, please submit a request below, and someone will reach out to you to answer your questions or you may call 1-877-882-4916.'
    )
    await agent.add(
      'If you are state child support worker from another state attempting to contact Mississippi, you may also use the request button below to submit a ticket if you have been unsuccessful in reaching us through other communication tools such as the federal child support portal.'
    )

    await agent.add(new Suggestion('SUBMIT SUPPORT REQUEST'))
    await agent.add(new Suggestion('SUBMIT FEEDBACK'))

    await agent.context.set({
      name: 'waiting-support-submitSupportRequest-interstate',
      lifespan: 1,
    })

    await agent.context.set({
      name: 'waiting-feedback-root',
      lifespan: 1,
    })
  } catch (err) {
    console.log(err)
  }
}