const { tbd } = require('../globalFunctions.js')

exports.taxes = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}