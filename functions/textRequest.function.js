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
const subjectMatterDiscriminator = 'smd';
subjectMatterInstancesMap.set(subjectMatterDiscriminator, require(process.env.SMD_KEY_FILE));

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

// Retrieve the subject matter the user is working with
const getSessionSubjectMatter = async (sessionId) => {
  const sessionInfo = await db.collection('sessions').doc(sessionId).get();

  // If not subject matter has been set, forward to the discriminator
  if (sessionInfo === undefined) {
    await setSessionSubjectMatter(subjectMatterDiscriminator);
    return subjectMatterDiscriminator;
  } else {
    return sessionInfo.subjectMatter;
  }
};

// Using the sessionId, record which subject matter the user is working with
const setSessionSubjectMatter = async (sessionId, subjectMatter) => {
  const sessionInfo = {
    "subjectMatter" : subjectMatter
  };
  
  await db.collection('sessions').doc(sessionId).set(sessionInfo);
};

// Submit the query to a target dialogFlow instance
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
};

// Infer if the intent on the dialogFlow response indicates if the user wants to change subject matter
const hasSubjectMatterChangeBeenRequested = (dialogFlowResponse) => {
  const intent = dialogFlowResponse.queryResult.intent.displayName;
  return intent.startsWith('change-subject-matter');
};

// Extract from the dialogFlow response which subject matter is being targeted. 
const determineTargetSubjectMatter = (dialogFlowResponse) => {
  const intent = dialogFlowResponse.queryResult.intent.displayName;
  const targetSubjectMatter = intent.split('-').pop();
  return targetSubjectMatter;
};

// Examine the request and session to determine how to handle the query
const processTextRequest = async (sessionId, query) => {
  // Using the current session subject matter, submit the request to dialogFlow
  let subjectMatter = await getSessionSubjectMatter(sessionId);
  let subjectMatterInstance = subjectMatterInstancesMap.get(subjectMatter);
  let dialogFlowResponse = await dispatchToDialogFlow(subjectMatterInstance, sessionId, query);

  // If the intent implies we need to switch subject matter, determine the target subject matter and query for a greeting message.
  if (hasSubjectMatterChangeBeenRequested(dialogFlowResponse)) {
    subjectMatter = determineTargetSubjectMatter(dialogFlowResponse);
    subjectMatterInstance = subjectMatterInstancesMap.get(subjectMatter);
    await setSessionSubjectMatter(sessionId, subjectMatter);
    dialogFlowResponse = await dispatchToDialogFlow(subjectMatterInstance, sessionId, 'subject matter changed');
  }

  return dialogFlowResponse;
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

      try {
        const query = req.query.query;
        const sessionId = req.query.uuid;
        const dialogFlowResponse = await processTextRequest(sessionId, query);      
        return res.json(dialogFlowResponse);
      } catch (err) {
        console.error(err);
        return res.status(500).send();
      }      
    })
  });
