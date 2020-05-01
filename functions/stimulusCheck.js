const { handleEndConversation } = require('./globalFunctions')

exports.stimulusCheck = async agent => {
    try {
        await agent.add(`To learn more about the Economic Impact (Stimulus) Payments and collecting child support arrears through the Treasury Offset Program, <a href="https://www.mdhs.ms.gov/faqs-on-economic-impact-stimulus-payments-and-the-treasury-offset-program/" target="_blank">click here.</a>`)

        await handleEndConversation(agent)
    } catch (err) {
        console.error(err)
    }
}