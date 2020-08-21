const {
  welcome,
  acknowledgePrivacyStatement,
  globalRestart,
  restartConversation,
  yesChildSupport,
  caseyHandoff,
  setContext,
} = require('./globalFunctions')

module.exports = {
  'Default Welcome Intent': welcome,
  'acknowledge-privacy-statement': acknowledgePrivacyStatement,
  'global-restart': globalRestart,
  'restart-conversation': restartConversation,
  'yes-child-support': yesChildSupport,
  'casey-handoff': caseyHandoff,
  'set-context': setContext,
}