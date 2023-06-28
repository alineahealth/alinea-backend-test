import { listBeneficiariesImportsFailedRowsFind } from "./list-beneficiaries-imports-failed-rows.find";
import {
  IListBeneficiariesImportsFailedRows,
  IListBeneficiariesImportsFailedRowsParams
} from "./list-beneficiaries-imports-failed-rows.types";

export const listBeneficiariesImportsFailedRows = async (
  params: IListBeneficiariesImportsFailedRowsParams
): Promise<IListBeneficiariesImportsFailedRows> => {
  const { queryStringParameters, pathParameters } = params;
  const page = queryStringParameters?.page
    ? parseInt(queryStringParameters.page)
    : 1;
  const itemsPerPage = queryStringParameters?.itemsPerPage
    ? parseInt(queryStringParameters.itemsPerPage)
    : 10;
  const processId = pathParameters?.processId
    ? pathParameters.processId
    : ''
  try {
    return await listBeneficiariesImportsFailedRowsFind({
      page,
      itemsPerPage,
      tracingID: params.tracingID,
      processId
    });
  } catch (err) {
    console.error(
      `${params.tracingID}: ${
        (err as Error).message
      } ERR_PG_BENEFICIARIES_IMPORTS_FAILED_ROWS ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};