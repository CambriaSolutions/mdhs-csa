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

intentMap.set('Default Fallback Intent', fallback);
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('acknowledge-privacy-statement', acknowledgePrivacyStatement);
intentMap.set('global-restart', globalRestart);
intentMap.set('restart-conversation', restartConversation);
intentMap.set('yes-child-support', yesChildSupport);
intentMap.set('casey-handoff', caseyHandoff);

exports.globalIntentHandlersMap = globalIntentHandlersMap;