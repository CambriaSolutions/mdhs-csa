import {
  welcome,
  acknowledgePrivacyStatement,
  globalRestart,
  restartConversation,
  caseyHandoff,
  setContext,
} from './globalFunctions'

module.exports = {
  'Default Welcome Intent': welcome,
  'acknowledge-privacy-statement': acknowledgePrivacyStatement,
  'global-restart': globalRestart,
  'restart-conversation': restartConversation,
  'casey-handoff': caseyHandoff,
  'set-context': setContext,
}