const { tbd } = require('./globalFunctions.js')

exports.insufficientResponse = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}