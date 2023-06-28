import {
  EventBridgeClient,
  PutEventsCommandInput,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export const publishEventBridgeEvent = async (
  detailType: string,
  eventBusName: string,
  awsRegion: string,
  trackingId: string,
  detail: object
) => {
  const client = new EventBridgeClient({ region: awsRegion });
  const params: PutEventsCommandInput = {
    Entries: [
      {
        Detail: JSON.stringify(detail),
        DetailType: detailType,
        Source: "beneficiary-domain",
        EventBusName: eventBusName,
      },
    ],
  };

  try {
    const command = new PutEventsCommand(params);
    const result = await client.send(command);
    console.info({
      message: `Publishing "${eventBusName}" into "${awsRegion}" region with trackingId: ${trackingId}`,
      data: result.$metadata.httpStatusCode,
    });
    return true;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
