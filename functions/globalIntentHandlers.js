const {
  welcome,
  acknowledgePrivacyStatement,
  globalRestart,
  restartConversation,
  yesChildSupport,
  caseyHandoff,
} = require('./intentHandlers/globalFunctions')

module.exports = {
  //'Default Fallback Intent': fallback,
  'Default Welcome Intent': welcome,
  'acknowledge-privacy-statement': acknowledgePrivacyStatement,
  'global-restart': globalRestart,
  'restart-conversation': restartConversation,
  'yes-child-support': yesChildSupport,
  'casey-handoff': caseyHandoff,
}