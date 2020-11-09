import { find, split, head } from 'lodash'
import { subjectMatterContexts } from '../constants/constants'

// Gets the subject matter from active context
export const getSubjectMatter = (agent) => {
  const subjectMatterContext = find(agent.contexts, context => subjectMatterContexts.includes(context.name))

  return subjectMatterContext ? head(split(subjectMatterContext.name, '-')) : ''
}