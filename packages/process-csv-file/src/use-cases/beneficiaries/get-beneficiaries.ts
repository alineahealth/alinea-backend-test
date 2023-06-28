import { getBeneficiariesByCompanyAndCpfs } from "../../repository/beneficiaries/beneficiaries";
import { IBeneficiary } from "../../repository/beneficiaries/beneficiaries.types";
import { IRowWithoutError } from "../../types/types";

export const processBeneficiaries = async (
  companyId: number,
  withoutErrors: IRowWithoutError[]
): Promise<[IRowWithoutError[], IRowWithoutError[], IBeneficiary[]]> => {
  const cpfsToQuery = withoutErrors.map(
    (beneficiary) => beneficiary.processedRow.cpf
  );

  const { items: recoveredBeneficiaries } =
    await getBeneficiariesByCompanyAndCpfs({
      companyId: companyId,
      cpfs: cpfsToQuery,
    });

  const beneficiariesToCreate = withoutErrors.filter(
    (beneficiary) =>
      !recoveredBeneficiaries.some(
        (beneficiaryToUpdate) =>
          beneficiaryToUpdate.cpf === beneficiary.processedRow.cpf
      )
  );

  const beneficiariesToUpdate = withoutErrors.filter((beneficiary) =>
    recoveredBeneficiaries.some(
      (beneficiaryToUpdate) =>
        beneficiaryToUpdate.cpf === beneficiary.processedRow.cpf
    )
  );

  return [beneficiariesToCreate, beneficiariesToUpdate, recoveredBeneficiaries];
};
