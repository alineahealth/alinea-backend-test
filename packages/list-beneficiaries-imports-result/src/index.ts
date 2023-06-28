import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { listBeneficiariesImportsResult } from "./list-beneficiaries-imports-result";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const tracingID = randomUUID();

  try {
    const listBeneficiariesImports = await listBeneficiariesImportsResult({
      queryStringParameters: event.queryStringParameters,
      tracingID,
    });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(listBeneficiariesImports),
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