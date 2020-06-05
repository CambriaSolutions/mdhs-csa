const { tbd } = require('../globalFunctions')

exports.accountInformation = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}