const { tbd } = require('../globalFunctions.js')

exports.paymentTimelines = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}