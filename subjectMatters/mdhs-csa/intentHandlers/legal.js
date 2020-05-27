const { tbd } = require('./globalFunctions.js')

exports.legal = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}