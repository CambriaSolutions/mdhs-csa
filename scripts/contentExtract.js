const fs = require('fs')
const globalIntentHandlers = require('../utils/globalIntentHandlers')
const commonIntentHandlers = require('../utils/commonIntentHandlers')
const childSupportIntentHandlers = require('../utils/childSupportIntentHandlers')

const intentHandlers = {
  ...globalIntentHandlers,
  ...commonIntentHandlers,
  ...childSupportIntentHandlers,
  // Overriding the fallback intent so we don't extract the automl handler
  'Default Fallback Intent': () => { }
}

function parameters() {
  this.supportType = '**SUPPORT TYPE**'
  this.phoneNumber = '**PHONE NUMBER**'
  this.supportSummary = '**SUPPORT SUMMARY**'
  this.employmentStatus = '**EMPLOYMENT STATUS**'
  this.email = '**EMAIL ADDRESS**'
  this.newEmployerPhone = '**NEW EMPLOYER PHONE**'
  this.newEmployerName = '**NEW EMPLOYER NAME'
  this.lastName = '**LAST NAME**'
  this.firstName = '**FIRST NAME**'
  this.companyName = '**COMPANY NAME**'
  this.caseNumber = '**CASE NUMBER**'
  this.retirementContributions = 0
  this.isSupporting = 'YES'
  this.inArrears = 'YES'
  this.disposableIncome = 0
  this.childSupportRequests = '**CHILDSUPPORT REQUESTS**'
  this.request = '**REQUEST**'
}

function context() {
  this.contexts = []
  this.get = () => {
    return { parameters: new parameters() }
  }
  this.set = (ctx) => {
    this.contexts.push(ctx)
  }
}

function agent() {
  this.UNSPECIFIED = 'PLATFORM_UNSPECIFIED'
  this.parameters = new parameters()
  // this.FACEBOOK = 'FACEBOOK',
  // this.SLACK = 'SLACK',
  // this.TELEGRAM = 'TELEGRAM',
  // this.KIK = 'KIK',
  // this.SKYPE = 'SKYPE',
  // this.LINE = 'LINE',
  // this.VIBER = 'VIBER',
  // this.ACTIONS_ON_GOOGLE = 'ACTIONS_ON_GOOGLE',
  this.phrases = []
  this.suggestions = []
  this.add = (phrase) => {
    if (phrase.replies) {
      this.suggestions.push(...phrase.replies)
    } else {
      this.phrases.push(phrase)
    }
  }
  this.context = new context()
}

const getIntentFilenames = (agentDirectory) => {
  const intents = []
  fs.readdirSync(`${agentDirectory}/intents`).forEach(function (file) {
    const filename = file.split('/').pop()
    if (!filename.endsWith('_usersays_en.json')) {
      intents.push(`${agentDirectory}/intents/${file}`)
    }
  })

  return intents
}

const getTrainingPhrases = (intentFile) => {
  const userSays = require(intentFile.replace('.json', '_usersays_en.json'))
  const trainingPhrases = []
  userSays.forEach((record) => {
    let phrase = ''
    record.data.forEach((data) => {
      phrase += data.text
    })
    trainingPhrases.push(phrase)
  })

  return trainingPhrases
}

const getResponseData = async (intentName) => {
  const handler = intentHandlers[intentName]
  const agt = new agent()
  await handler(agt)

  return {
    phrases: agt.phrases,
    suggestions: agt.suggestions,
    contexts: agt.context.contexts
  }
}

const generateOutputFile = async (intentFile) => {
  const output = {}
  const intent = require(intentFile)

  output.id = intent.id
  output.intentName = intent.name
  output.inputContexts = intent.contexts
  output.trainingPhrases = getTrainingPhrases(intentFile)

  const responseData = await getResponseData(intent.name)
  output.responsePhrases = responseData.phrases
  output.suggestions = responseData.suggestions

  output.outputContexts = []
  responseData.contexts.forEach((handlerAffectedContext) => {
    handlerAffectedContext.actor = 'code'
    output.outputContexts.push(handlerAffectedContext)
  })

  if (intent.responses) {
    intent.responses.forEach((response => {
      if (response.affectedContexts) {
        response.affectedContexts.forEach((dialogflowAffectedContext) => {
          dialogflowAffectedContext.actor = 'dialogflow'
          output.outputContexts.push(dialogflowAffectedContext)
        })
      }
    }))
  }

  return output
}

//fs.writeFileSync(handlerFile, content);

const doExtract = async () => {
  const intents = getIntentFilenames('../agent')
  await intents.forEach(async (intent) => {
    try {
      if (!intent.includes('handleUnhandled')) {
        const extract = await generateOutputFile(intent)
        fs.writeFileSync(`../content/${extract.intentName}.json`, JSON.stringify(extract, null, 4), 'utf-8')
      }
    } catch (err) {
      const pathElements = intent.split('/')
      const intentName = pathElements.pop().split('.')[0]
      fs.writeFileSync(`../content/ERROR-${intentName}-ERROR.txt`, err, 'utf-8')
    }
  })
}

doExtract()
  .then(() => {
    console.log('done')
  })
  .catch(err => {
    console.error(err)
  })