const { tbd } = require('../globalFunctions.js')

exports.documentation = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}