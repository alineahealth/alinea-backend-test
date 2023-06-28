"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEventBridgeEvent = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const publishEventBridgeEvent = async (detailType, eventBusName, awsRegion, trackingId, detail) => {
    const client = new client_eventbridge_1.EventBridgeClient({ region: awsRegion });
    const params = {
        Entries: [
            {
                Detail: JSON.stringify(detail),
                DetailType: detailType,
                Source: 'beneficiary-domain',
                EventBusName: eventBusName
            },
        ],
    };
    try {
        const command = new client_eventbridge_1.PutEventsCommand(params);
        const result = await client.send(command);
        console.info({
            trackingId,
            message: `will publish ${eventBusName} into ${awsRegion}`,
            data: result.$metadata.httpStatusCode
        });
        return true;
    }
    catch (error) {
        throw new Error(JSON.stringify(error));
    }
};
exports.publishEventBridgeEvent = publishEventBridgeEvent;
