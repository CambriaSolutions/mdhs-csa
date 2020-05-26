const { tbd } = require('./globalFunctions.js')

exports.refund = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}