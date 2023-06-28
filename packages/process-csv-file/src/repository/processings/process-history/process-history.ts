import { createProcessHistory } from "./process-history.create";
import { IProcessHistoryCreateParams } from "./process-history.types";

export const createProcessHistoryAsync = async (
  params: IProcessHistoryCreateParams
): Promise<boolean> => {
  try {
    return await createProcessHistory(params);
  } catch (error) {
    console.error(
      `${
        (error as Error).message
      } ERROR_PG_CREATE_PROCESS_HISTORY ${JSON.stringify(
        (error as Error).stack
      )}`
    );
    throw new Error((error as Error).message);
  }
};
