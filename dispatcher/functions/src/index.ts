import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as corsPackage from 'cors';
import { processRequest } from './processRequest';
import RequestType from './RequestType';

admin.initializeApp();

const cors = corsPackage({
    origin: true,
})

const runtimeOpts: functions.RuntimeOptions = {
    timeoutSeconds: 300,
    memory: '2GB',
}

const handleRequest = async (req: functions.https.Request, res: functions.Response, requestType: RequestType) => {
    if (!req.query || !req.query.query) {
        return res.status(400).send('The "query" parameter is required');
    }

    if (!req.query || !req.query.uuid) {
        return res.status(400).send('The "uuid" parameter is required');
    }

    try {
        const dialogFlowResponse = await processRequest(<string>req.query.uuid, <string>req.query.query, RequestType.Text);
        return res.json(dialogFlowResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}

exports.textRequest = functions
    .runWith(runtimeOpts)
    .https.onRequest(async (req, res) => {
        return cors(req, res, async () => {
            return handleRequest(req, res, RequestType.Text);
        })
    });

exports.eventRequest = functions
    .runWith(runtimeOpts)
    .https.onRequest(async (req, res) => {
        return cors(req, res, async () => {
            return handleRequest(req, res, RequestType.Event);
        })
    });