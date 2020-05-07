require('dotenv').config()
const fs = require('fs')
const dialogflow = require('dialogflow')

const dfConfig = {
    credentials: {
        private_key: `${(process.env.AGENT_PRIVATE_KEY || '').replace(/\\n/g, '\n')}`,
        client_email: `${process.env.AGENT_CLIENT_EMAIL}`
    }
}

const client = new dialogflow.v2.AgentsClient(dfConfig)

client.exportAgent({ parent: `projects/${process.env.AGENT_PROJECT}` })
    .then(responses => {
        const [operation, initialApiResponse] = responses;

        // Operation#promise starts polling for the completion of the LRO.
        return operation.promise();
    })
    .then(responses => {
        fs.writeFile(`export_${process.env.AGENT_PROJECT}_${new Date().toISOString().slice(0, 10)}.zip`, responses[0].agentContent, (err) => {
            if (err)
                console.error(err)
            console.log("Completed");
        });
    })
    .catch(err => {
        console.error(err);
    });