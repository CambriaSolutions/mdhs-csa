const { defaultFallback } = require('../globalFunctions')
const { autoMlFallback } = require('./categorizeAndPredict')

exports.noneOfThese = async agent => {
  // TODO For now, treat as unhandled w/o ML.
  // In the future record the phrase, category, and suggestions not selected.
  try {
    await defaultFallback(agent)
  } catch (err) {
    console.error(err)
  }
}

exports.commonFallback = async agent => {
  if (agent.context.get('cse-subject-matter')) {
    return autoMlFallback(agent)
  } else {
    return defaultFallback(agent)
  }
}