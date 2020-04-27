const { tbd } = require('./globalFunctions.js')

exports.childcare = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}