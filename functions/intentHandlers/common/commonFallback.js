const { defaultFallback } = require('../globalFunctions')
const { autoMlFallback } = require('./categorizeAndPredict')

// const determineSubjectMatter = async agent => {
//   const cse = agent.context.get('cse-subject-matter')
//   if (cse) {
//     return 'cse'
//   }

//   return 'none'
// }

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
  //if (determineSubjectMatter(agent) === 'cse') {
  const cseContext = agent.context.get('cse-subject-matter')
  console.log('CSE Context', cseContext)
  return autoMlFallback(agent)
  //} else {
//    return defaultFallback(agent)
//  }
}