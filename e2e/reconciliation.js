require('dotenv').config()
const parseIntentDataFromExcelDocument = require('./parseIntentDataFromExcelDocument')

const fs = require('fs')
require('chai').should()

const AGENT_DIRECTORY = '../agent/intents'

// const startSessionsAndPreloadContexts = async (intents) => {
//     const promises = []
//     Object.entries(intents).forEach(([intentName, intentData]) => {
//         intentData.trainingPhrases.forEach(phrase => {
//             const sessionId = uuidv4();
//             sessions[intentName + "::" + phrase] = sessionId
//             promises.push(db.collection('preloadedContexts').doc(sessionId).set({
//                 contexts: intentData.inputContexts
//             }))
//         })
//     })

//     await Promise.all(promises)
// }

// const askGen = async (intentName, phrase, intentData) => {
//     it(`Gen should reply with the [${intentName}] intent when asked [${phrase}] with input contexts [${intentData.inputContexts}]`, async () => {
//         const sessionId = sessions[intentName + "::" + phrase]
//         const sessionPath = sessionClient.sessionPath(projectId, sessionId);
//         if (intentData.inputContexts.length > 0) {
//             await ask(sessionClient, sessionPath, 'set-context');
//         }

//         const reply = await ask(sessionClient, sessionPath, phrase);
//         reply.intent.should.equal(intentName)
//     })
// }

const getAgentIntent = (intentName) => {
    const agentIntent = require(`${AGENT_DIRECTORY}/${intentName}.json`)
    const intent = {
        inputContexts: agentIntent.contexts,
        outputContexts: agentIntent.responses[0].affectedContexts.map(ctx => { return { name: ctx.name, lifespan: ctx.lifespan }}),
        content: agentIntent.responses[0].messages.map(ctx => { return ctx.speech})
    }    
}

const getAgentTrainingPhrases = (intentName) => {
    const filename = `${AGENT_DIRECTORY}/${intentName}_usersays_en.json`
    if (fs.existsSync(filename)) {
        const agentUserSays = require(filename)
        const agentTrainingPhrases = []
        agentUserSays.forEach(userSay => {
            if (userSay.data) {
                const text = []
                userSay.data.forEach(data => {
                    text.push(data.text)
                })
                agentTrainingPhrases.push(text.join(' '))
            }
        })

        console.log(agentTrainingPhrases)
        //return agentTrainingPhrases
    }

    return
    
}

const validateInputContexts = (intentName, inputContexts) => {
    
}

const validateOutputContexts = (intentName, outputContexts) => {
    
}

const validateTrainingPhrases = (intentName, traininPhrases) => {

}

const validateIntent = (intentName, intentData) => {

}

// describe('Gen Regression Testing', async () => {
     const intents = parseIntentDataFromExcelDocument('./Master spreadsheet.xlsx', 'intent_context_content')

//     describe('Running tests', async () => {
        Object.entries(intents).forEach(([intentName, intentData]) => {
            getAgentTrainingPhrases(intentName)
        })
//     })
// })
