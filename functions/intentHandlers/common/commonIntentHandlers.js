const { handleUnhandled, noneOfThese } = require('./categorizeAndPredict.js')

module.exports = {
    'none-of-these': noneOfThese,
    'Default Fallback Intent': handleUnhandled
}