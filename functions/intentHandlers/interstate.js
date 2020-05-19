const { tbd } = require('../globalFunctions.js')

exports.interstate = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}