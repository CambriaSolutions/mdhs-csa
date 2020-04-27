const { tbd } = require('./globalFunctions.js')

exports.greaterThanOneMonth = async agent => {
    try {
        await tbd(agent)
    } catch (err) {
        console.log(err)
    }
}