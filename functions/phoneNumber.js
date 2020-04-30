const { tbd } = require('./globalFunctions.js')

exports.phoneNumber = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}