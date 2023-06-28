import { APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { getAllInsurersAsync } from "./list-insurers";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const tracingId = randomUUID();

  try {
    const insurers = await getAllInsurersAsync(tracingId);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(insurers),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: (err as Error).message,
    };
  }
};
