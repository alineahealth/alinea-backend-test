import { IDependent, IListDependentsParams } from "./list-dependents.type";
import { listDependentsFind } from "./list-dependents.find";

export const listDependents = async (
  params: IListDependentsParams
): Promise<IDependent[]> => {
  const { pathParameters } = params;

  try {
    if(!pathParameters.cpf){
      throw new Error("Can not list all dependents without holder cpf");
    }

    return await listDependentsFind({
      tracingID: params.tracingID,
      cpf: pathParameters.cpf, 
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
