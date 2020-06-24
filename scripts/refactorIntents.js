const fs = require('fs')

const blackListedIntents = [
  'Default Welcome Intent',
  'global-restart',
  'restart-conversation',
  'not-child-support-root',
  'yes-child-support',
  'acknowledge-privacy-statement',
  'casey-handoff',
  'Default Fallback Intent',
  'doc-upload',
  'map-root',
  'map-deliver-map',
  'none-of-these',
]

const getIntentFilenames = (agentDirectory) => {
  const intents = []
  fs.readdirSync(`${agentDirectory}/intents`).forEach(function (file) {
    const filename = file.split('/').pop()
    if (!filename.endsWith('_usersays_en.json')
      && !blackListedIntents.includes(filename.split('.')[0])) {
      intents.push(`${agentDirectory}/intents/${file}`)
    }
  })

  return intents
}

const addCsaKbContext = (file, name) => {
  const intent = require(file)
  intent.name = name
  intent.contexts.push('cse-subject-matter')
  intent.responses[0].affectedContexts.push({
    'name': 'cse-subject-matter',
    'parameters': {},
    'lifespan': 99
  })
  fs.writeFileSync(file, JSON.stringify(intent, null, 4), 'utf-8')
}

const replaceAllRenamedIntentReferences = (nameChanges) => {
  const handlerFile = '../functions/intentHandlers/childSupport/childSupportIntentHandler.js'
  let content = fs.readFileSync(handlerFile, 'utf-8')
  Object.entries(nameChanges).forEach((value) => {
    const [original, renamed] = value
    content = content.replace(original, renamed)
  })
  fs.writeFileSync(handlerFile, content)
}

const doIntentRenames = (intents) => {
  const renatedIntents = {}
  intents.forEach((value) => {
    const pathElements = value.split('/')
    const currentFilename = pathElements.pop().split('.')[0]
    addCsaKbContext(value, currentFilename)
    const renamedFilename = `cse-${currentFilename}`
    renatedIntents[currentFilename] = renamedFilename
    const path = pathElements.join('/')

    pathElements.push(`${renamedFilename}.json`)
    fs.renameSync(value, pathElements.join('/'))
    fs.renameSync(`${path}/${currentFilename}_usersays_en.json`, `${path}/${renamedFilename}_usersays_en.json`)
  })

  replaceAllRenamedIntentReferences(renatedIntents)
}

const refactor = () => {
  const intents = getIntentFilenames('../agent')
  doIntentRenames(intents)
}

refactor()