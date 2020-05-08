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

const updateAgentFiles = (updatedFilesDirectory) => {

}

client.exportAgent({ parent: `projects/${process.env.AGENT_PROJECT}` })
    .then(responses => {
        const [operation, initialApiResponse] = responses;

        // Operation#promise starts polling for the completion of the LRO.
        return operation.promise();
    })
    .then(responses => {
        const path = './export/';
        fs.mkdirSync(path);
        fs.mkdirSync(`${path}/intents`);
        fs.mkdirSync(`${path}/entities`);

        var zip = new JSZip();
        zip.loadAsync(responses[0].agentContent).then(function (contents) {
            Object.keys(contents.files).forEach(function (filename) {
                zip.file(filename).async('nodebuffer').then(function (content) {
                    var dest = path + filename;
                    fs.writeFileSync(dest, content);
                });
            });

            // Clean
            fs.readdirSync(`${path}/intents`).forEach(function (file, index) {
                fs.unlinkSync(`${path}/${file}`);
            });
            fs.rmdirSync(`${path}/intents`);
            fs.readdirSync(`${path}/entities`).forEach(function (file, index) {
                fs.unlinkSync(`${path}/${file}`);
            });
            fs.rmdirSync(`${path}/entities`);
            fs.readdirSync(`${path}`).forEach(function (file, index) {
                fs.unlinkSync(`${path}/${file}`);
            });
            fs.rmdirSync(path);

            return;
        });
    })
    .catch(err => {
        console.error(err);
    });