const { tbd } = require('./globalFunctions.js')

exports.tanf = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}