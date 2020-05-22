const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const dialogflow = require('dialogflow');

const cors = require('cors')({
  origin: true,
})

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
}

// Register SMD, always
const subjectMatterInstancesMap = new Map();
const smdKnowledgeBase = 'smd';
subjectMatterInstancesMap.set(smdKnowledgeBase, require(process.env.SMD_KEY_FILE));

// Register additional knowledge bases
const registeredSubjectMatters = require('./registeredSubjectMatters.js');
registeredSubjectMatters().forEach((value, key) => {
  subjectMatterInstancesMap.set(key, {
    projectId: value.projectId,
    sessionClient: new dialogflow.SessionsClient({
      credentials: {
        private_key: value.private_key,
        client_email: value.client_email
      }
    })
  });
});

const getSessionSubjectMatter = async (sessionId) => {
  const sessionInfo = await db.collection('sessions').doc(sessionId).get();
  if (sessionInfo === undefined) {
    return smdKnowledgeBase;
  } else {
    return sessionInfo.subjectMatter;
  }
};

const setSessionSubjectMatter = async (sessionId, knowledgeBase) => {
  const sessionInfo = {
    "subjectMatter" : knowledgeBase
  };
  
  await db.collection('sessions').doc(sessionId).set(sessionInfo);
};

const dispatchToDialogFlow = async (subjectMatterInstance, sessionId, query) => {
  return new Promise((resolve, reject) => {
    const sessionPath = sessionClient.sessionPath(subjectMatterInstance.projectId, sessionId);
    subjectMatterInstance.sessionClient
      .detectIntent({
        session: sessionPath,
        queryInput: { text: { text: query, languageCode: 'en-US' } },
      })
      .then(responses => {
        resolve(responses[0]);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.textRequest = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      if (!req.query || !req.query.query) {
        return 'The "query" parameter is required'
      }
      if (!req.query || !req.query.uuid) {
        return 'The "uuid" parameter is required'
      }

      const query = req.query.query;
      const sessionId = req.query.uuid;

      const subjectMatter = await getSessionSubjectMatter(sessionId);
      const subjectMatterInstance = subjectMatterInstancesMap.get(subjectMatter);
      const dialogFlowResponse = await dispatchToDialogFlow(subjectMatterInstance, sessionId, query);

      return sessionClient
        .detectIntent(dfRequest)
        .then(responses => {
          // return responses[0]
          responses[0].session = sessionPath
          res.json(responses[0])
        })
        .catch(err => {
          console.error('textRequest.function.js: ', err)
          return `Dialogflow error: ${err}`
        })
    })
  })
