import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { listDependents } from "./list-dependents";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const tracingID = randomUUID();

  try {
    if(!event.pathParameters) {
      throw new Error("Can not list all dependents without pathParameters");
    }
    const listDependentsResult = await listDependents({
      pathParameters: event.pathParameters,
      tracingID,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(listDependentsResult),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: (err as Error).message,
    };
  }
};
