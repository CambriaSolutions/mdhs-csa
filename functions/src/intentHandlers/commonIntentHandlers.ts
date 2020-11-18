import { commonFallback, noneOfThese } from './common/commonFallback.js'
import { docUpload } from './common/docUpload.js'

// Feedback
import {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} from './common/feedback.js'

export const commonIntentHandlers = {
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