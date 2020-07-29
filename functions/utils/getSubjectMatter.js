// Gets the subject matter from active context
module.exports = (agent) => {
  if (agent.context.get('cse-subject-matter')) {
    return 'cse'
  } else if (agent.context.get('tanf-subject-matter')) {
    return 'tanf'
  } else if (agent.context.get('snap-subject-matter')) {
    return 'snap'
  } else {
    return ''
  }
}