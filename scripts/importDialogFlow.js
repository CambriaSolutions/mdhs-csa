require('dotenv').config()
const fs = require('fs')
const dialogflow = require('dialogflow')
const JSZip = require('jszip');

const dfConfig = {
    credentials: {
        private_key: `${(process.env.AGENT_PRIVATE_KEY || '').replace(/\\n/g, '\n')}`,
        client_email: `${process.env.AGENT_CLIENT_EMAIL}`
    }
}

const client = new dialogflow.v2.AgentsClient(dfConfig)
const zip = new JSZip();

zip.file("package.json", fs.readFileSync('../agent/package.json'))
zip.file('agent.json', fs.readFileSync('../agent/agent.json'));

const intentFiles = fs.readdirSync('../agent/intents');
intentFiles.forEach(intentFile => {
    zip
        .folder('intents')
        .file(intentFile, fs.readFileSync(`../agent/intents/${intentFile}`))
});

const entityFiles = fs.readdirSync('../agent/entities');
entityFiles.forEach(entityFile => {
    zip
        .folder('entities')
        .file(entityFile, fs.readFileSync(`../agent/entities/${entityFile}`))
});

zip.generateAsync({ type: "uint8array" })
    .then(function (content) {
        console.log('Agent files zipped');
        client.importAgent({ parent: `projects/${process.env.AGENT_PROJECT}`, agentContent: content })
            .then(responses => {
                const [operation, initialApiResponse] = responses;
                // Operation#promise starts polling for the completion of the LRO.
                return operation.promise();
            })
            .then(responses => {
                console.log('Imported')
                return;
            })
            .catch(err => {
                console.error(err);
            });

        return;
    });