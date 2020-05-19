const { tbd } = require('../globalFunctions.js')

exports.fax = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}