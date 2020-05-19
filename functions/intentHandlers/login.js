const { tbd } = require('../globalFunctions.js')

exports.login = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}