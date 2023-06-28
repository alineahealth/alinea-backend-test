import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { listBeneficiaries } from "./list-beneficiaries";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const tracingID = randomUUID();

  try {
    const listBeneficiariesResult = await listBeneficiaries({
      queryStringParameters: event.queryStringParameters,
      tracingID,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(listBeneficiariesResult),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: (err as Error).message,
    };
  }
};
