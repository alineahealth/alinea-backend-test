import { createProcess } from "./process.create";
import { updateProcess } from "./process.update";
import { IProcessCreateParams, IProcessUpdateParams } from "./process.types";

export const createNewProcessAsync = async (
  params: IProcessCreateParams
): Promise<boolean> => {
  try {
    return await createProcess(params);
  } catch (error) {
    console.error(
      `${(error as Error).message} ERROR_PG_CREATE_PROCESS ${JSON.stringify(
        (error as Error).stack
      )}`
    );
    throw new Error((error as Error).message);
  }
};

export const updateProcessAsync = async (
  params: IProcessUpdateParams
): Promise<boolean> => {
  try {
    return await updateProcess(params);
  } catch (error) {
    console.error(
      `${(error as Error).message} ERROR_PG_UPDATE_PROCESS ${JSON.stringify(
        (error as Error).stack
      )}`
    );
    throw new Error((error as Error).message);
  }
};
