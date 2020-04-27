const { tbd } = require('./globalFunctions.js')

exports.childCare = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}