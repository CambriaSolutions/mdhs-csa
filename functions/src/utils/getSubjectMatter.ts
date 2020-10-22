import { find, split, head } from 'lodash'
import { subjectMatterContexts } from '../constants/constants.js'

// Gets the subject matter from active context
export default (agent) => {
  const subjectMatterContext = find(agent.contexts, context => subjectMatterContexts.includes(context.name))

  return subjectMatterContext ? head(split(subjectMatterContext.name, '-')) : ''
}