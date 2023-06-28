import {
  IBeneficiary,
  IBeneficiaryDatabase,
} from "../repository/beneficiaries/beneficiaries.types";

export const convertObjToBeneficiary = (
  line: IBeneficiaryDatabase
): IBeneficiary => {
  return {
    id: line.id,
    companyId: line.company_id,
    healthPlanCardId: line.health_plan_card_id,
    holderHealthPlanCardId: line.holder_health_plan_card_id,
    beneficiaryTypeId: line.beneficiary_type_id,
    name: line.name,
    cpf: line.cpf,
    birthDate: line.birth_date,
    healthPlanId: line.health_plan_id,
    statusId: line.status_id,
    gender: line.gender,
    createdAt: new Date(line.created_at),
    updatedAt: new Date(line.updated_at),
    deletedAt: line.deleted_at ? new Date(line.deleted_at) : undefined,
    acceptedTermsAt: line.accepted_terms_at
      ? new Date(line.accepted_terms_at)
      : undefined,
    phoneNumber: line.phone_number,
    displayName: line.display_name,
  };
};
