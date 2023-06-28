import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { putManyBeneficiaries } from "./put-many-beneficiaries";
import { IBeneficiaryData } from "./put-many-beneficiaries.type";

export const handler = async (
  event: APIGatewayEvent,
): Promise<APIGatewayProxyResult> => {
  const tracingID = randomUUID();
  try {
    const {body } = event;

    if(!body) {
      throw new Error("I can not insert beneficiaries without a body with information");
    }

    const requestBody: IBeneficiaryData[] = JSON.parse(body);

    if(requestBody.length > 500) {
      throw new Error("I can process more than 500 beneficiaries per time");
    }

    console.info("The call have authorization and body with no more than 500 beneficiaries")

    const manyBeneficiaries = await putManyBeneficiaries({
      body: requestBody,
      tracingID,
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify(manyBeneficiaries)
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: (err as Error).message,
    };
  }
};
