const { map } = require('lodash')

exports.subjectMatters = [
  'cse',
  'tanf',
  'snap',
  'wfd'
]

exports.subjectMatterLabels = [
  'Child Support',
  'TANF',
  'SNAP',
  'Workforce Development'
]

exports.subjectMatterContexts = map(this.subjectMatters, sm => `${sm}-subject-matter`)