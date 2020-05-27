const { tbd } = require('./globalFunctions.js.js.js')

exports.snap = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}