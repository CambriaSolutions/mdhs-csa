import * as admin from 'firebase-admin';
import * as dialogflow from '@google-cloud/dialogflow'
import KeyFile from "./KeyFile";
import registeredSubjectMatters from "./registeredSubjectMatters";
import RequestType from './RequestType';

type DialogFlowRequest = dialogflow.protos.google.cloud.dialogflow.v2.IDetectIntentRequest;

interface DialogFlowResponse extends dialogflow.protos.google.cloud.dialogflow.v2.IDetectIntentResponse {
  session: string;
}

interface SessionInformation {
  subjectMatter: string;
}

class SubjectMatterInstance {
  constructor(public projectId: string,
      public sessionClient: dialogflow.v2.SessionsClient) {

  }
}

const createSubjectMatterInstance = (keyFile: KeyFile) => {
  const sessionClient = new dialogflow.v2.SessionsClient({
    credentials: {
      private_key: keyFile.private_key,
      client_email: keyFile.client_email
    }
  });

  return new SubjectMatterInstance(keyFile.project_id, sessionClient);
};

// Register SMD, always
const subjectMatterInstancesMap = new Map<string, SubjectMatterInstance>();
const subjectMatterDiscriminator: string = 'smd';
const subjectMatterDiscriminatorKeyFile = <KeyFile>require(process.env.SMD_KEY_FILE!);
subjectMatterInstancesMap.set(subjectMatterDiscriminator, createSubjectMatterInstance(subjectMatterDiscriminatorKeyFile));

// Register additional knowledge bases
registeredSubjectMatters().forEach((value: KeyFile, key: string) => {
  subjectMatterInstancesMap.set(key, createSubjectMatterInstance(value));
});

// Retrieve the subject matter the user is working with
const getSessionSubjectMatter = async (sessionId: string) => {
  const docRef = await admin.firestore().collection('sessions').doc(sessionId).get();
  const sessionInformation = <SessionInformation | undefined>(await docRef?.data());

  // If not subject matter has been set, forward to the discriminator
  if (sessionInformation) {
    await setSessionSubjectMatter(sessionId, subjectMatterDiscriminator);
    return subjectMatterDiscriminator;
  } else {
    return sessionInformation!.subjectMatter;
  }
};

// Using the sessionId, record which subject matter the user is working with
const setSessionSubjectMatter = async (sessionId: string, subjectMatter: string) => {
  const sessionInfo = <SessionInformation>{
    "subjectMatter": subjectMatter
  };

  await admin.firestore().collection('sessions').doc(sessionId).set(sessionInfo);
};

const createDialogFlowRequest = (sessionPath: string, query: string, requestType: RequestType): DialogFlowRequest => {
  let dialogFlowRequest: DialogFlowRequest;
  switch (requestType) {
    case RequestType.Event:
      dialogFlowRequest = {
        session: sessionPath,
        queryInput: { text: { text: query, languageCode: 'en-US' } }
      };
      break;
    case RequestType.Text:
    default:
      dialogFlowRequest = {
        session: sessionPath,
        queryInput: { text: { text: query, languageCode: 'en-US' } }
      };
  }

  return dialogFlowRequest;
};

// Submit the query to a target dialogFlow instance
const dispatchToDialogFlow = async (subjectMatterInstance: SubjectMatterInstance, sessionId: string, query: string, requestType: RequestType): Promise<DialogFlowResponse> => {
  return new Promise((resolve, reject) => {
    const sessionPath = subjectMatterInstance.sessionClient.projectAgentSessionPath(subjectMatterInstance.projectId, sessionId);
    const dialogFlowRequest = createDialogFlowRequest(sessionPath, query, requestType);
    subjectMatterInstance.sessionClient
      .detectIntent(dialogFlowRequest)
      .then(responses => {
        const dialogFlowResponse = <DialogFlowResponse>responses[0];
        dialogFlowResponse.session = sessionPath;
        resolve();
      })
      .catch(err => {
        reject(err);
      });
  });
};

// Infer if the intent on the dialogFlow response indicates if the user wants to change subject matter
const hasSubjectMatterChangeBeenRequested = (dialogFlowResponse: DialogFlowResponse): boolean => {
  const intent = dialogFlowResponse?.queryResult?.intent?.displayName;
  return intent?.startsWith('change-subject-matter') ?? false;
};

// Extract from the dialogFlow response which subject matter is being targeted. 
const determineTargetSubjectMatter = (dialogFlowResponse: DialogFlowResponse): string => {
  const intent = dialogFlowResponse?.queryResult?.intent?.displayName;
  const targetSubjectMatter = intent?.split('-').pop() ?? subjectMatterDiscriminator;
  return targetSubjectMatter;
};

// Examine the request and session to determine how to handle the query
export const processRequest = async (sessionId: string, query: string, requestType: RequestType): Promise<DialogFlowResponse> => {
  return new Promise<DialogFlowResponse>(async (resolve, reject) => {
    // Using the current session subject matter, submit the request to dialogFlow
    let subjectMatter = await getSessionSubjectMatter(sessionId);
    let subjectMatterInstance = subjectMatterInstancesMap.get(subjectMatter);
    let dialogFlowResponse: DialogFlowResponse;
    if (subjectMatterInstance) {
      dialogFlowResponse = await dispatchToDialogFlow(subjectMatterInstance, sessionId, query, requestType);
    } else {
      reject(`Unable process request, subject matter [${subjectMatter}] was not found.`);
      return;
    }

    // If the intent implies we need to switch subject matter, determine the target subject matter and query for a greeting message.
    if (hasSubjectMatterChangeBeenRequested(dialogFlowResponse)) {
      subjectMatter = determineTargetSubjectMatter(dialogFlowResponse);
      subjectMatterInstance = subjectMatterInstancesMap.get(subjectMatter);
      if (subjectMatterInstance) {
        await setSessionSubjectMatter(sessionId, subjectMatter);
        dialogFlowResponse = await dispatchToDialogFlow(subjectMatterInstance, sessionId, 'subject matter changed', requestType);
      } else {
        reject(`Unable process request, subject matter [${subjectMatter}] was not found.`);
        return;
      }
    }

    resolve(dialogFlowResponse);
    return;
  });
}

