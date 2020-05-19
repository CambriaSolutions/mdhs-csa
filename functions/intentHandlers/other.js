const { tbd } = require('../globalFunctions.js')

exports.other = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}