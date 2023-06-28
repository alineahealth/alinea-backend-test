import { getAllCompanies } from "./list-companies.find";
import { IListCompanies } from "./list-companies.types";

export const getAllCompaniesAsync = async (
  tracingId: string
): Promise<IListCompanies> => {
  try {
    return await getAllCompanies({ tracingId });
  } catch (err) {
    console.error(
      `${tracingId}: ${
        (err as Error).message
      } ERR_PG_COMPANIES_LIST ${JSON.stringify((err as Error).stack)}`
    );
    throw new Error((err as Error).message);
  }
};
