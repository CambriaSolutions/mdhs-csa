require('dotenv').config()
const keyFile = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
const parseIntentDataFromExcelDocument = require('./parseIntentDataFromExcelDocument')
const admin = require('firebase-admin')
admin.initializeApp()
const dialogflow = require('dialogflow')
const projectId = keyFile.project_id
const { v4: uuidv4 } = require('uuid')

require('chai').should()

const ask = require("./ask.js");

const sessionClient = new dialogflow.SessionsClient();

const intents = parseIntentDataFromExcelDocument('./Master spreadsheet.xlsx', 'intent_context_content')

const askGen = (intentName, phrase, intentData) => {
    it(`Gen should reply with the [${intentName}] intent when asked [${phrase}]`, async () => {
        const sessionId = uuidv4();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        const reply = await ask(sessionClient, sessionPath, phrase);
        reply.intent.should.equal(intentName)        
    })
}

describe('Gen Regression Testing', () => {
    Object.entries(intents).forEach(([intentName, intentData]) => {
        if(intentData.inputContexts.length === 0) {
            intentData.trainingPhrases.forEach(phrase => {
                askGen(intentName, phrase, intentData)
            })
        }
    })
})
