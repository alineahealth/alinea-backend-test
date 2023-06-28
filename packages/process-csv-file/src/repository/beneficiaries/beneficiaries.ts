import { createBeneficiaries } from "./beneficiaries.create";
import { updateBeneficiaries } from "./beneficiaries.update";
import { createBeneficiariesHistory } from "./beneficiaries-history.create";
import {
  listBeneficiariesByCompanyAndCpfs,
  listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms,
} from "./beneficiaries.find";
import {
  IBeneficiariesHistoriesParams,
  IBeneficiary,
  IBeneficiaryCreateParams,
  IBeneficiaryUpdateParams,
  IListBeneficiariesParams,
  IListBeneficiaries,
  IListBeneficiariesToActivate,
} from "./beneficiaries.types";
import { convertObjToBeneficiary } from "../../utils/beneficiary-helpers";

export const createBeneficiariesAsync = async (
  params: IBeneficiaryCreateParams
): Promise<boolean> => {
  try {
    return await createBeneficiaries(params);
  } catch (err) {
    console.error(
      `${
        (err as Error).message
      } ERROR_PG_BENEFICIARIES_CREATE_MANY ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};

export const updateBeneficiariesAsync = async (
  params: IBeneficiaryUpdateParams
): Promise<IBeneficiary[]> => {
  try {
    const result = await updateBeneficiaries(params);
    const beneficiaries = result.map((beneficiary) => {
      return convertObjToBeneficiary(beneficiary);
    });
    return beneficiaries;
  } catch (err) {
    console.error(
      `${
        (err as Error).message
      } ERROR_PG_BENEFICIARIES_UPDATE_MANY ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};

export const getBeneficiariesByCompanyAndCpfs = async (
  params: IListBeneficiariesParams
): Promise<IListBeneficiaries> => {
  const { companyId, cpfs } = params;

  try {
    if (cpfs.length === 0) {
      return { items: [] };
    }
    const result = await listBeneficiariesByCompanyAndCpfs(companyId, cpfs);

    const beneficiaries = result?.items?.map((beneficiary) => {
      return convertObjToBeneficiary(beneficiary);
    });
    return { items: beneficiaries };
  } catch (err) {
    console.error(
      `${
        (err as Error).message
      } ERROR_PG_BENEFICIARIES_BY_COMPANY_AND_CPF ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};

export const getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms = async (
  params: IListBeneficiariesParams
): Promise<IListBeneficiariesToActivate> => {
  const { companyId, cpfs } = params;

  try {
    return await listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms(
      companyId,
      cpfs
    );
  } catch (err) {
    console.error(
      `${
        (err as Error).message
      } ERROR_PG_BENEFICIARIES_BY_COMPANY_AND_CPF_AND_ACCEPTEDTERMS ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};

export const createBeneficiariesHistoriesAsync = async (
  params: IBeneficiariesHistoriesParams
): Promise<boolean> => {
  try {
    return await createBeneficiariesHistory(params);
  } catch (err) {
    console.error(
      `${
        (err as Error).message
      } ERROR_PG_BENEFICIARIES_HISTORIES_CREATE_MANY ${JSON.stringify(
        (err as Error).stack
      )}`
    );
    throw new Error((err as Error).message);
  }
};
