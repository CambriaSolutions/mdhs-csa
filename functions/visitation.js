const { tbd } = require('./globalFunctions.js')

exports.visitation = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}