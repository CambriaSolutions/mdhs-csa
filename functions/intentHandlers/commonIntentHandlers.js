const { commonFallback, noneOfThese } = require('./common/commonFallback.js')
const { docUpload } = require('./common/docUpload.js')

// Feedback
const {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} = require('./common/feedback.js')

module.exports = {
  'none-of-these': noneOfThese,
  'Default Fallback Intent': commonFallback,
  'doc-upload': docUpload,
  
  // Feedback intents
  'feedback-root': feedbackRoot,
  'feedback-helpful': feedbackHelpful,
  'feedback-not-helpful': feedbackNotHelpful,
  'feedback-complete': feedbackComplete,

  // Complaints
  'complaints-root': feedbackRoot,
}