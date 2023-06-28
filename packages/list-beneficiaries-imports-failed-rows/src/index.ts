import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { listBeneficiariesImportsFailedRows } from "./list-beneficiaries-imports-failed-rows";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const tracingID = randomUUID();

  try {
    const failedRows = await listBeneficiariesImportsFailedRows({
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
      tracingID,
    });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(failedRows),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: (err as Error).message,
    };
  }
};