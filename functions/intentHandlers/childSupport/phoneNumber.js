const { tbd } = require('../globalFunctions')

exports.phoneNumber = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}