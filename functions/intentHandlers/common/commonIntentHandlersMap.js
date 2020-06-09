const { handleUnhandled, noneOfThese } = require('./categorizeAndPredict.js')

module.exports = () => {
    const commonIntentHandlersMap = new Map();

    commonIntentHandlersMap.set('none-of-these', noneOfThese);
    commonIntentHandlersMap.set('Default Fallback Intent', handleUnhandled)

    return commonIntentHandlersMap;
}