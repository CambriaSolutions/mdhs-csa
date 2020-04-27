const { tbd } = require('./globalFunctions.js')

exports.complaints = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}