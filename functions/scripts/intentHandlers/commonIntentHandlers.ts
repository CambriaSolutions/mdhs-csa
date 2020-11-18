import { commonFallback, noneOfThese } from '../../src/intentHandlers/common/commonFallback'
import { docUpload } from '../../src/intentHandlers/common/docUpload'

// Feedback
import {
  feedbackRoot,
  feedbackHelpful,
  feedbackNotHelpful,
  feedbackComplete,
} from '../../src/intentHandlers/common/feedback'

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