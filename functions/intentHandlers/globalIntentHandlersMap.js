const {
    fallback,
    welcome,
    acknowledgePrivacyStatement,
    globalRestart,
    restartConversation,
    yesChildSupport,
    caseyHandoff,
} = require('./globalFunctions');

const globalIntentHandlersMap = new Map();

globalIntentHandlersMap.set('Default Fallback Intent', fallback);
globalIntentHandlersMap.set('Default Welcome Intent', welcome);
globalIntentHandlersMap.set('acknowledge-privacy-statement', acknowledgePrivacyStatement);
globalIntentHandlersMap.set('global-restart', globalRestart);
globalIntentHandlersMap.set('restart-conversation', restartConversation);
globalIntentHandlersMap.set('yes-child-support', yesChildSupport);
globalIntentHandlersMap.set('casey-handoff', caseyHandoff);

exports.globalIntentHandlersMap = globalIntentHandlersMap;