import { APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { getAllCompaniesAsync } from "./list-companies";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const tracingId = randomUUID();

  try {
    const companies = await getAllCompaniesAsync(tracingId);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(companies),
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
