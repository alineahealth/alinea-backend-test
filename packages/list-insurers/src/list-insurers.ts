import { getAllInsurersQueryAsync } from "./list-insurers.find";
import { IListInsurers } from "./list-insurers.types";

export const getAllInsurersAsync = async (
  tracingId: string
): Promise<IListInsurers> => {
  try {
    return await getAllInsurersQueryAsync({ tracingId });
  } catch (err) {
    console.error(
      `${tracingId}: ${
        (err as Error).message
      } ERR_PG_INSURERS_LIST ${JSON.stringify((err as Error).stack)}`
    );
    throw new Error((err as Error).message);
  }
};
