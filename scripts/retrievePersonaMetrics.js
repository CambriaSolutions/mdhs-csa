require('dotenv').config()
const admin = require('firebase-admin')
const fs = require('fs')

admin.initializeApp()

const db = admin.firestore()
const requestsRef = db.collection('projects/mdhs-csa/requests');
const personaMetrics = new Map()
const sessionMetrics = new Map()

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const queryAndGenerateOutpuFile = async (personaIntents, filename) => {
    
  const snapshot = await requestsRef.where('queryResult.intent.displayName', 'in', personaIntents).get()
  
  if (snapshot.empty) {
    console.warn('no records found')
  }

  let stream = fs.createWriteStream(filename, { flags: 'a' });
  await asyncForEach(snapshot.docs, async doc => {
    const request = doc.data();
    const output = {
      id: doc.id,
      createdAt: request.createdAt,
      intentName: request.queryResult.intent.displayName,
      sessionId: request.session.split('/').pop()
    }

    if (personaIntents.includes(output.intentName)) {
      stream.write(JSON.stringify(output) + ',')
    }
  })
  stream.end();
}

const retrievePersonaMetrics = async () => {
  const personaIntentMappings = {
    // 'cse-employer-root': 'Employer',
    // 'cse-support-employer': 'Employer',
    // 'cse-pmts-general-receive-payments': 'CP',
    // 'cse-support-parent-receiving': 'CP',
    // 'cse-pmts-general-non-custodial': 'NCP',
    // 'cse-support-parent-paying': 'NCP',
    'employer-root': 'Employer',
    'support-employer': 'Employer',
    'pmts-general-receive-payments': 'CP',
    'support-parent-receiving': 'CP',
    'pmts-general-non-custodial': 'NCP',
    'support-parent-paying': 'NCP'
  }
  const personaIntents = [...Object.keys(personaIntentMappings)]
  console.log('Starting')

  try {
    const filename = './export.json'
    await queryAndGenerateOutpuFile(personaIntents, filename)
    const requests = require(filename)

    requests.forEach(request => {
      const intentName = request.intentName
      if (personaIntents.includes(intentName)) {
        // console.log(`${intentName} >> ${personaIntentMappings[intentName]}`)
        const requestDate = new Date(request.createdAt._seconds * 1000)
        const metricsKey = `${requestDate.getMonth() + 1}/${requestDate.getDate()}/${requestDate.getFullYear()}`
        let metrics = personaMetrics.get(metricsKey)
        if (metrics === undefined || metrics === null) {
          metrics = {
            cpCount: 0,
            ncpCount: 0,
            employerCount: 0
          }
        }

        let personas = sessionMetrics.get(request.sessionId)
        const persona = personaIntentMappings[intentName]
        if (personas === undefined || personas === null) {
          personas = [persona]
          switch(persona) {
            case 'CP':
              metrics.cpCount += 1
              break
            case 'NCP':
              metrics.ncpCount += 1
              break
            case 'Employer': 
              metrics.employerCount += 1
              break
            default:
              break
          }
        } else {
          if (!personas.includes(persona)) {
            personas.push(persona)
          }
        }

        sessionMetrics.set(request.sessionId, personas)

        personaMetrics.set(metricsKey, metrics)
      }
    })
  } catch (e) {
    console.error(e)
  }
  console.log('Finished')
}

retrievePersonaMetrics();