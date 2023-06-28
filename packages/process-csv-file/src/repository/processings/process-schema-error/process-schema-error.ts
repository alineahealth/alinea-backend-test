import { createProcessSchemaError } from "./process-schema-error.create";
import { IProcessSchemaErrorCreateParams } from "./process-schema-error.types";

export const createProcessSchemaErrorAsync = async (
  params: IProcessSchemaErrorCreateParams
): Promise<boolean> => {
  try {
    return await createProcessSchemaError(params);
  } catch (error) {
    console.error(
      `${
        (error as Error).message
      } ERROR_PG_CREATE_PROCESS_SCHEMA ${JSON.stringify(
        (error as Error).stack
      )}`
    );
    throw new Error((error as Error).message);
  }
};
