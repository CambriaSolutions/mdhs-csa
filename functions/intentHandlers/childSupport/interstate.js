const { tbd } = require('../globalFunctions')

exports.interstate = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}