const { tbd } = require('./globalFunctions.js')

exports.gratitude = async agent => {
    try {
        await agent.add(
            `You're welcome. I am glad I was able to help.`
        )
    } catch (err) {
        console.error(err)
    }
}