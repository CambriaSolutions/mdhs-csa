const { tbd } = require('../globalFunctions.js')

exports.fee = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}