export interface IListBeneficiariesParams {
  companyId: number;
  cpfs: string[];
}

export interface IListBeneficiaries {
  items: Array<IBeneficiary>;
}

export interface IListBeneficiariesData {
  items: Array<IBeneficiaryDatabase>;
}

export interface IBeneficiaryDatabase {
  id: string;
  company_id: number;
  health_plan_card_id: string;
  holder_health_plan_card_id: string;
  beneficiary_type_id: number;
  name: string;
  cpf: string;
  birth_date: string;
  health_plan_id: number;
  status_id: number;
  gender: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  accepted_terms_at?: Date;
  phone_number: string;
  display_name: string;
}

export interface IBeneficiary {
  id: string;
  companyId: number;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  beneficiaryTypeId: number;
  name: string;
  cpf: string;
  birthDate: string;
  healthPlanId: number;
  statusId: number;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  acceptedTermsAt?: Date;
  phoneNumber: string;
  displayName: string;
}

export interface IListBeneficiariesToActivate {
  items: Array<IBeneficiaryToActivate>;
}

export interface IBeneficiaryToActivate {
  id: string;
  cpf: string;
  display_name: string;
  accepted_terms_at: Date;
  phone_number: string;
}

export interface IBeneficiaryToCreate {
  id: string;
  companyId: number;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  beneficiaryTypeId: number;
  name: string;
  cpf: string;
  birthDate: Date;
  healthPlanId?: number;
  statusId: number;
  gender: string;
  holderCpf: string;
  createdAt: Date;
}

export interface IBeneficiaryCreateParams {
  beneficiaries: IBeneficiaryToCreate[];
}

export interface IBeneficiaryUpdateParams {
  beneficiaries: IBeneficiaryToUpdate[];
}

export interface IBeneficiaryToUpdate {
  id: string;
  healthPlanId?: number;
  healthPlanCardId?: string;
  holderHealthPlanCardId?: string;
  updatedAt: Date;
}

export interface IBeneficiariesHistoriesParams {
  beneficiaries: IBeneficiaryHistory[];
}

export interface IBeneficiaryHistory {
  beneficiary_id: string;
  date: Date;
  action: string;
  status_id: number;
}
