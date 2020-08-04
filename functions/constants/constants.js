const { map } = require('lodash')
const cseLocations = require('../coordinates/cse.json')
const snapLocations = require('../coordinates/snap.json')
const tanfLocations = require('../coordinates/tanf.json')

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

exports.subjectMatterLocations = {
  'cse': cseLocations,
  'snap': snapLocations,
  'tanf': tanfLocations
}