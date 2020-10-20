const fs = require('fs')
require('dotenv').config()

const admin = require('firebase-admin')
const batchSize = 1000;
admin.initializeApp()
const db = admin.firestore()

const getIntentNames = (agentDirectory) => {
    const intents = []
    fs.readdirSync(`${agentDirectory}/intents`).forEach(function (file) {
        const filename = file.split('/').pop()
        if (!filename.endsWith('_usersays_en.json')) {
            intents.push(`${file.replace('.json', '')}`)
        }
    })

    return intents
}

const createIntentMap = (intentNames) => {
    const intentMap = new Map()

    intentNames.forEach(currentIntentName => {
        if(currentIntentName.startsWith('cse-')) {
            const intentNameParts = currentIntentName.split('-')
            intentNameParts.shift()
            const originalIntentName = intentNameParts.join('-')
            intentMap.set(originalIntentName, currentIntentName)
        }
    })

    intentMap.delete('root')

    return intentMap
}

const getUpdatedIntentName = (intentName, intentMap) => {
    if ([...intentMap.keys()].includes(intentName)
    && ![...intentMap.values()].includes(intentName)) {
        return intentMap.get(intentName)
    } else {
        return intentName
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// const migrateRequests = async (currentCollectionPath, targetCollectionPath, intentMap) => {
//     const targetCollectionRef = db.collection(targetCollectionPath);

//     let lastBatchDoc
//     let position = 0
//     let hasResults = false;
//     do {
//         let snapshot
//         if (lastBatchDoc !== undefined) {
//             snapshot = await db.collection(currentCollectionPath).orderBy('createdAt').startAfter(lastBatchDoc).limit(batchSize).get();
//         } else {
//             snapshot = await db.collection(currentCollectionPath).orderBy('createdAt').limit(batchSize).get();
//         }
        
//         if (snapshot.empty) {
//             hasResults = false;
//         } else {
//             const docs = [...snapshot.docs]
//             console.log(`${snapshot.docs.length} docs, batch ${(position / batchSize) + 1}`);
            
//             await asyncForEach(docs, async doc => {
//                 let requestData = doc.data()
//                 //fs.writeFileSync(`./requestData/orig/${doc.id}.json`, JSON.stringify(requestData))
    
//                 // Last Intents
//                 if (requestData.queryResult !== undefined && requestData.queryResult.intent !== undefined) {
//                     requestData.queryResult.intent.displayName = getUpdatedIntentName(requestData.queryResult.intent.displayName, intentMap)
//                 }

//                 //fs.writeFileSync(`./requestData/updated/${doc.id}.json`, JSON.stringify(requestData))
//                 //await targetCollectionRef.doc(doc.id).set(metricData)
//             })    
            
//             hasResults = true
//             position += batchSize
//             lastBatchDoc = docs[docs.length - 1]
//         }
//     } while (hasResults === true)
// }

const migrateConversations = async (currentCollectionPath, targetCollectionPath, intentMap) => {
    const targetCollectionRef = db.collection(targetCollectionPath);

    let lastBatchDoc
    let position = 0
    let hasResults = false;
    do {
        let snapshot
        if (lastBatchDoc !== undefined) {
            snapshot = await db.collection(currentCollectionPath).orderBy('createdAt').startAfter(lastBatchDoc).limit(batchSize).get();
        } else {
            snapshot = await db.collection(currentCollectionPath).orderBy('createdAt').limit(batchSize).get();
        }
        
        if (snapshot.empty) {
            hasResults = false;
        } else {
            const docs = [...snapshot.docs]
            console.log(`${snapshot.docs.length} docs, batch ${(position / batchSize) + 1}`);
            
            await asyncForEach(docs, async doc => {
                let conversationData = doc.data()
                fs.writeFileSync(`./coversationData/orig/${doc.id}.json`, JSON.stringify(conversationData))
    
                // Last Intents
                if (conversationData.lastIntent !== undefined) {
                    conversationData.lastIntent.name = getUpdatedIntentName(conversationData.lastIntent.name, intentMap)
                }

                fs.writeFileSync(`./coversationData/updated/${doc.id}.json`, JSON.stringify(conversationData))
                await targetCollectionRef.doc(doc.id).set(conversationData)
            })    
            
            hasResults = true
            position += batchSize
            lastBatchDoc = docs[docs.length - 1]
        }
    } while (hasResults === true)
}

const migrateMetrics = async (currentCollectionPath, targetCollectionPath, intentMap) => {
    const targetCollectionRef = db.collection(targetCollectionPath);

    let lastBatchDoc
    let position = 0
    let hasResults = false;
    do {
        let snapshot
        if (lastBatchDoc !== undefined) {
            snapshot = await db.collection(currentCollectionPath).orderBy('date').startAfter(lastBatchDoc).limit(batchSize).get();
        } else {
            snapshot = await db.collection(currentCollectionPath).orderBy('date').limit(batchSize).get();
        }
        
        if (snapshot.empty) {
            hasResults = false;
        } else {
            const docs = [...snapshot.docs]
            console.log(`${snapshot.docs.length} docs, batch ${(position / batchSize) + 1}`);
            
            await asyncForEach(docs, async doc => {
                let metricData = doc.data()
                fs.writeFileSync(`./metricData/orig/${doc.id}.json`, JSON.stringify(metricData))
    
                // Dailt Exit Intents
                if (metricData.dailyExitIntents !== undefined) {
                    Object.keys(metricData.dailyExitIntents).forEach(dailyExitIntentKey => {
                        metricData.dailyExitIntents[dailyExitIntentKey].name = getUpdatedIntentName(metricData.dailyExitIntents[dailyExitIntentKey].name, intentMap)
                    })
                }

                // Exit Intents                
                if (metricData.exitIntents !== undefined) {
                    for(let exitIntentIndex in metricData.exitIntents) {
                        metricData.exitIntents[exitIntentIndex].name = getUpdatedIntentName(metricData.exitIntents[exitIntentIndex].name, intentMap)
                    }
                }
    
                // Intents
                if (metricData.intents !== undefined) {
                    for(let intentIndex in metricData.intents) {
                        metricData.intents[intentIndex].name = getUpdatedIntentName(metricData.intents[intentIndex].name, intentMap)
                    }
                }

                fs.writeFileSync(`./metricData/updated/${doc.id}.json`, JSON.stringify(metricData))
                await targetCollectionRef.doc(doc.id).set(metricData)
            })    
            
            hasResults = true
            position += batchSize
            lastBatchDoc = docs[docs.length - 1]
        }
    } while (hasResults === true)
}

const migrateProjectToSubjectMatter = async (project, subjectMatter) => {
    const intentMap = createIntentMap(getIntentNames('../../mdhs-csa/agent'))

    const snapshot = await db.collection("projects").doc(project).get();
    if (snapshot.empty || snapshot.data() === undefined) {
        console.log('No matching documents.');
    } else {
        console.log(`Creating subjectMatters/${subjectMatter}`);
        await db.collection("subjectMatters").doc(subjectMatter).set(snapshot.data())
    }

    // await asyncForEach(["conversations", "metrics", "queriesForLabeling", "queriesForTraining", "requests"], async subCollection => {
    //     console.log(`Migrating projects/${project}/${subCollection} => subjectMatters/${subjectMatter}/${subCollection}`)
    //     await migrateCollection(`projects/${project}/${subCollection}`, `subjectMatters/${subjectMatter}/${subCollection}`, intentMap);
    // })

    await migrateConversations(`projects/${project}/conversations`, `subjectMatters/${subjectMatter}/conversations`, intentMap);
    await migrateMetrics(`projects/${project}/metrics`, `subjectMatters/${subjectMatter}/metrics`, intentMap);
    //await migrateRequests(`projects/${project}/requests`, `subjectMatters/${subjectMatter}/requests`, intentMap);
}

// // TODO enter the projectName and the target subject matter before running
//migrateProjectToSubjectMatter('mdhs-csa-dev', 'test-migrate-cse')
//migrateProjectToSubjectMatter('mdhs-csa-isd-273818', 'test-migrate-cse')
migrateProjectToSubjectMatter('mdhs-csa-stage', 'test-migrate-cse')
// // migrateProjectToSubjectMatter('mdhs-csa', 'cse')


