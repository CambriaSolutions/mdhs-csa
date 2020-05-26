const { tbd } = require('./globalFunctions.js')

exports.verification = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}