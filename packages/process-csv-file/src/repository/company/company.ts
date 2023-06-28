import { getCompanyById } from "./company.find";
import { ICompany, ICompanyParams } from "./company.type";

export const getCompanyByIdAsync = async (
  params: ICompanyParams
): Promise<ICompany> => {
  const { companyId } = params;
  try {
    const result = await getCompanyById(params);
    if (!result) {
      throw new Error(`I can not find company information by id ${companyId}`);
    }
    return result;
  } catch (err) {
    console.error(
      `${(err as Error).message} ERROR_PG_COMPANY_BY_ID ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};
