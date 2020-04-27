const { tbd } = require('./globalFunctions.js')

exports.paidButNotReceived = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}