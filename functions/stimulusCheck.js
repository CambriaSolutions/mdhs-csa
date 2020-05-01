const { handleEndConversation } = require('./globalFunctions')
const { Suggestion } = require('dialogflow-fulfillment')

exports.stimulusCheck = async agent => {
    try {
        await agent.add(`To learn more about the Economic Impact (Stimulus) Payments and collecting child support arrears through the Treasury Offset Program, <a href="https://www.mdhs.ms.gov/faqs-on-economic-impact-stimulus-payments-and-the-treasury-offset-program/" target="_blank">click here.</a>`)

        await handleEndConversation(agent)

        await agent.add(new Suggestion('Submit Support Request'))

        await agent.context.set({
            name: 'waiting-caseQA-general-support-request',
            lifespan: 2,
        })

        await agent.context.set({
            name: 'waiting-restart-conversation',
            lifespan: 2,
        })
    } catch (err) {
        console.error(err)
    }
}