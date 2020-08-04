const { find, split, head } = require('lodash')
const { subjectMatterContexts } = require('../constants/constants.js')

// Gets the subject matter from active context
module.exports = (agent) => {
  const subjectMatterContext = find(agent.contexts, context => subjectMatterContexts.includes(context.name))

  return subjectMatterContext ? head(split(subjectMatterContext.name)) : ''
}