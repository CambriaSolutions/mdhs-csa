require('dotenv').config()
const mdhsCsaKey = require('./keys/mdhs-csa-dev.json')
const webchatKey = require('./keys/webchat-analytics-dev-key.json')

const admin = require('firebase-admin')
const mdhs = admin.initializeApp({
    credential: admin.credential.cert(mdhsCsaKey)
})
const webchat = admin.initializeApp({
    credential: admin.credential.cert(webchatKey)
}, "webchat");

const mdhsDb = mdhs.firestore()
const webchatDb = webchat.firestore()

const copyDocsAtPath = async (path) => {
    const copyingDocs = []
    const snap = await webchatDb.collection(path).get()
    snap.docs.forEach(doc => {
        copyingDocs.push(mdhsDb.collection(path).doc(doc.id).set(doc.data()))
    })
    return Promise.all(copyingDocs)
}

const copySingleSubjectMatter = async (subjectMatterName) => {
    await Promise.all([
        copyDocsAtPath(`subjectMatters/${subjectMatterName}/queriesForLabeling`),
        copyDocsAtPath(`subjectMatters/${subjectMatterName}/queriesForTraining`),
        copyDocsAtPath(`subjectMatters/${subjectMatterName}/metrics`)
    ])
}

const copyAllSubjectMatters = async () => {
    const sms = ['general', 'cse', 'snap', 'tanf', 'wfd'];
    const copyingSubjectMatters = []
    sms.forEach(subjectMatterName => {
        copyingSubjectMatters.push(copySingleSubjectMatter(subjectMatterName))
    })
    await Promise.all(copyingSubjectMatters)      
}

const copyData = async () => {
    await Promise.all([
        copyDocsAtPath('settings'),
        //copyDocsAtPath('users'),
        copyDocsAtPath('subjectMatters'),
        copyAllSubjectMatters()
    ])
}

copyData();