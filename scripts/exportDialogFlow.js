require('dotenv').config()
const fs = require('fs')
const dialogflow = require('dialogflow')
const JSZip = require('jszip')
const IntentComparator = require('./intentComparator.js')

const client = new dialogflow.v2.AgentsClient()

const setupExportDir = (path) => {
  fs.mkdirSync(path)
  fs.mkdirSync(`${path}/intents`)
  fs.mkdirSync(`${path}/entities`)
}

const cleanExportDir = (path) => {
  fs.readdirSync(`${path}/intents`).forEach(function (file) {
    fs.unlinkSync(`${path}/intents/${file}`)
  })
  fs.rmdirSync(`${path}/intents`)
  fs.readdirSync(`${path}/entities`).forEach(function (file) {
    fs.unlinkSync(`${path}/entities/${file}`)
  })
  fs.rmdirSync(`${path}/entities`)
  fs.readdirSync(`${path}`).forEach(function (file) {
    fs.unlinkSync(`${path}/${file}`)
  })
  fs.rmdirSync(path)
  return
}

console.log('Exporting...')
client.exportAgent({ parent: `projects/${process.env.AGENT_PROJECT}` })
  .then(responses => {
    const [operation] = responses

    // Operation#promise starts polling for the completion of the LRO.
    return operation.promise()
  })
  .then(responses => {
    console.log('Extracting...')
    const path = './export'
    setupExportDir(path)

    var zip = new JSZip()
    zip.loadAsync(responses[0].agentContent).then(function (contents) {
      Object.keys(contents.files).forEach(function (filename) {
        zip.file(filename).async('nodebuffer').then(function (content) {
          fs.writeFileSync(`${path}/${filename}`, content)
          return
        })
      })

      setTimeout(() => {
        console.log('Comparing...')
        fs.readdirSync(`${path}/intents`).forEach(function (file) {
          if (file.match(/^[a-zA-Z-]+\.json/g)) {
            const intentName = file.replace('.json', '')
            const comparator = new IntentComparator(intentName, '../agent/intents', `${path}/intents`)
            if (!comparator.compare()) {
              fs.writeFileSync(`../agent/intents/${intentName}.json`, fs.readFileSync(`${path}/intents/${intentName}.json`))
              fs.writeFileSync(`../agent/intents/${intentName}_usersays_en.json`, fs.readFileSync(`${path}/intents/${intentName}_usersays_en.json`))
            }
          }
        })

        console.log('Cleaning up...')
        cleanExportDir(path)
        console.log('Done')
      }, 3000)

      return
    })
  })
  .catch(err => {
    console.error(err)
  })