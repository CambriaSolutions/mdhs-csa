require('dotenv').config()
const fs = require('fs')

const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()






const getMetrics = async (subjectMatter) => {
    const snap = await db.collection(`subjectMatters/${subjectMatter}/metrics`).get()
    
    const fallbacksMap = new Map()
    snap.docs.forEach(doc => {
        const metric = doc.data()
        //console.log(metric)
        if (metric.fallbackTriggeringQueries) {
            metric.fallbackTriggeringQueries.forEach(fallbackTriggeringQuery => {
                if (!fallbacksMap.has(fallbackTriggeringQuery.queryText)) {
                    fallbacksMap.set(fallbackTriggeringQuery.queryText, fallbackTriggeringQuery.occurrences)
                } else {
                    const occurrences = fallbacksMap.get(fallbackTriggeringQuery.occurrences)
                    fallbacksMap.set(fallbackTriggeringQuery.queryText, occurrences + fallbackTriggeringQuery.occurrences)
                }
            })
        }
    })

    return fallbacksMap
}

const run = async () => {
    const snap = await getMetrics('snap')
    fs.writeFileSync('./snap.json', JSON.stringify(Array.from(snap.entries())))
    const tanf = await getMetrics('tanf')
    fs.writeFileSync('./tanf.json', JSON.stringify(Array.from(tanf.entries())))
    //console.log(metrics)
}

run()
