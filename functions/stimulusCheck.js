const { handleEndConversation } = require('./globalFunctions')

exports.stimulusCheck = async agent => {
    try {
        await agent.add(`To learn more about the Economic Impact (Stimulus) Payments and collecting child support arrears through the Treasury Offset Program, click here.`)

        await handleEndConversation(agent)
    } catch (err) {
        console.error(err)
    }
}