const { autoMlFallback } = require('./categorizeAndPredict')

const determineSubjectMatter = async agent => {
  const cse = agent.context.get('cse-subject-matter')
  if (cse && cse.lifespan > 0) {
    return 'cse'
  }

  return 'none'
}

const defaultFallback = async agent => {
  try {
    await agent.add(
      'I’m sorry, I’m not familiar with that right now, but I’m still learning! I can help answer a wide variety of questions about Child Support; <strong>please try rephrasing</strong> or click on one of the options provided. If you need immediate assistance, please contact the Child Support Call Center at <a href="tel:+18778824916">877-882-4916</a>.'
    )
  } catch (err) {
    console.error(err)
  }
}

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
  if (determineSubjectMatter(agent) === 'cse') {
    return autoMlFallback(agent)
  } else {
    return defaultFallback(agent)
  }
}