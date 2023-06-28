import { listBeneficiariesImportsResultFind } from "./list-beneficiaries-imports-result.find";
import {
  IListBeneficiariesImportsResult,
  IListBeneficiariesParams,
} from "./list-beneficiaries-imports-result.types";

export const listBeneficiariesImportsResult = async (
  params: IListBeneficiariesParams
): Promise<IListBeneficiariesImportsResult> => {
  const { queryStringParameters } = params;
  const page = queryStringParameters?.page
    ? parseInt(queryStringParameters.page)
    : 1;
  const itemsPerPage = queryStringParameters?.itemsPerPage
    ? parseInt(queryStringParameters.itemsPerPage)
    : 10;
  try {
    return await listBeneficiariesImportsResultFind({
      page,
      itemsPerPage,
      tracingID: params.tracingID,
    });
  } catch (err) {
    console.error(
      `${params.tracingID}: ${
        (err as Error).message
      } ERR_PG_BENEFICIARIES_IMPORTS_LIST ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};