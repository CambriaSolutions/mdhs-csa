const { map } = require('lodash')
const coordinatesSet1 = require('../coordinates/coordinatesSet1.json')
const coordinatesSet2 = require('../coordinates/coordinatesSet2.json')

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

// SNAP, TANF, WFD have the same locations. CSE locations are separate.
exports.subjectMatterLocations = {
  'cse': coordinatesSet1,
  'snap': coordinatesSet2,
  'tanf': coordinatesSet2,
  'wfd': coordinatesSet2
}