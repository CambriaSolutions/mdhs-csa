const { tbd } = require('../globalFunctions.js')

exports.snap = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}