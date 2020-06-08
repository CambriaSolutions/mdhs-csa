const { tbd } = require('../globalFunctions')

exports.email = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}