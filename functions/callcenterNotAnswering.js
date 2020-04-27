const { tbd } = require('./globalFunctions.js')

exports.callcenterNotAnswering = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}