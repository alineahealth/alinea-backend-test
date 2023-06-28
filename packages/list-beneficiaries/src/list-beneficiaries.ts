import {
  IListBeneficiariesParams,
  IListBeneriaries,
} from "./list-beneficiaries.types";
import { listBeneficiariesFind } from "./list-beneficiaries.find";

export const listBeneficiaries = async (
  params: IListBeneficiariesParams
): Promise<IListBeneriaries> => {
  const { queryStringParameters } = params;
  const page = queryStringParameters?.page
    ? parseInt(queryStringParameters.page)
    : 1;
  const itemsPerPage = queryStringParameters?.itemsPerPage
    ? parseInt(queryStringParameters.itemsPerPage)
    : 10;
  try {
    return await listBeneficiariesFind({
      page,
      itemsPerPage,
      tracingID: params.tracingID,
      cpf: queryStringParameters?.cpf,
      name: queryStringParameters?.name,
    });
  } catch (err) {
    console.error(
      `${params.tracingID}: ${
        (err as Error).message
      } ERR_PG_BENEFICIARIES_LIST ${JSON.stringify((err as Error).stack)}`
    );
    throw new Error((err as Error).message);
  }
};
