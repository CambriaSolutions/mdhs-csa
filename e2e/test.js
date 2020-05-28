const admin = require('firebase-admin');
const dialogflow = require('dialogflow');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
admin.initializeApp();

const ask = require("./ask.js");

describe('Gen responds to me', () => {
    const sessionClient = new dialogflow.SessionsClient();
    let sessionId;
    let sessionPath;    

    beforeEach(async () => {
        sessionId = uuidv4();
        sessionPath = sessionClient.sessionPath(process.env.AGENT_PROJECT, sessionId);
    });

    test('Gen welcomes me', async () => {
        let reply = await ask(sessionClient, sessionPath, 'hi');
        expect(reply.intent).toBe('Default Welcome Intent');
    });

    test('Gen asks me if I\'m asking about child support', async () => {
        let reply = await ask(sessionClient, sessionPath, 'hi');
        expect(reply.intent).toBe('Default Welcome Intent');
        reply = await ask(sessionClient, sessionPath, 'Yes');
        expect(reply.intent).toBe('yes-child-support');
    });

    test('Gen presents me with a privacy disclaimer', async () => {
        let reply = await ask(sessionClient, sessionPath, 'hi');
        expect(reply.intent).toBe('Default Welcome Intent');
        reply = await ask(sessionClient, sessionPath, 'Yes');
        expect(reply.intent).toBe('yes-child-support');
        reply = await ask(sessionClient, sessionPath, 'I Acknowledge');
        expect(reply.intent).toBe('acknowledge-privacy-statement');
    });

    test('Gen responds to Common Requests', async () => {
        const reply = await ask(sessionClient, sessionPath, 'Common Requests');
        expect(reply.intent).toBe('support-root');
    });

    test('Gen responds to Employer', async () => {
        const reply = await ask(sessionClient, sessionPath, 'Employer');
        expect(reply.intent).toBe('employer-root');
    });
})



    // const errorCount = await conversation
    //     .expectIntent('Default Welcome Intent')
    //     .expectReply('Hi, I\'m Gen. I am not a real person, but I can help you with common child support requests. Are you here to get help with Child Support?')
    //     .expectContext('waiting-yes-child-support')
    //     .expectContext('waiting-not-child-support')
    //     .expectSuggestion('Yes')
    //     .expectSuggestion('No')
    //     .replyWith('Yes')
    //     .expectReply('')
    //     .converse();

