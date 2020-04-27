const { tbd } = require('./globalFunctions.js')

exports.complaint = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}