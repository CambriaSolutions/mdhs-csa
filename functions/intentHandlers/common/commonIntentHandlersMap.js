const { handleUnhandled, noneOfThese } = require('./categorizeAndPredict.js')

const commonIntentHandlersMap = new Map();

commonIntentHandlersMap.set('none-of-these', noneOfThese);
commonIntentHandlersMap.set('Default Fallback Intent', handleUnhandled)

module.exports = commonIntentHandlersMap;