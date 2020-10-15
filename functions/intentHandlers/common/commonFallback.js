const { defaultFallback } = require('../globalFunctions')
const Logger = require('../../utils/Logger')
const logger = new Logger('Common Fallback')

exports.noneOfThese = async agent => {
  // TODO For now, treat as unhandled w/o ML.
  // In the future record the phrase, category, and suggestions not selected.
  try {
    await defaultFallback(agent)
  } catch (err) {
    console.error(err.message, err)
  }
}

exports.commonFallback = async agent => {
  if (agent.context.get('cse-subject-matter') !== undefined) {
    const { autoMlFallback } = require('./categorizeAndPredict')

    return autoMlFallback(agent)
  } else {
    return defaultFallback(agent)
  }
}