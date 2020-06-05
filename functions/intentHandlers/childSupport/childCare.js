const { tbd } = require('../globalFunctions')

exports.childCare = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}