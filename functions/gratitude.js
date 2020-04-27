const { tbd } = require('./globalFunctions.js')

exports.gratitude = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}