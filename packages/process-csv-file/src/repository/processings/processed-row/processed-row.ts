import { createProcessedRows } from "./processed-row.create";
import { IProcessedRowCreateParams } from "./processed-row.types";

export const createProcessedRowsAsync = async (
  params: IProcessedRowCreateParams
): Promise<boolean> => {
  try {
    return await createProcessedRows(params);
  } catch (error) {
    console.error(
      `${
        (error as Error).message
      } ERROR_PG_CREATE_PROCESSED_ROW ${JSON.stringify((error as Error).stack)}`
    );
    throw new Error((error as Error).message);
  }
};
