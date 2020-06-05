const { tbd } = require('./globalFunctions.js')

exports.onlineAction = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}