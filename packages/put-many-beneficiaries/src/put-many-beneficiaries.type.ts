import { APIGatewayProxyEventHeaders } from "aws-lambda";

export interface IPutManyAccess {
  tracingID: string;
  headers: APIGatewayProxyEventHeaders;
}

export interface ICreateBeneficiary {
  companyId: number;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  beneficiaryTypeId: number;
  name: string;
  cpf: string;
  birthDate: Date;
  healthPlanId: number;
  gender: string;
}

export interface IBeneficiary {
  id?: string;
  company_id?: number;
  health_plan_card_id: string;
  holder_health_plan_card_id?: string;
  beneficiary_type_id?: number;
  name: string;
  cpf: string;
  birth_date?: string;
  health_plan_id: number;
  status_id?: number;
  gender: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  accepted_terms_at?: Date;
  phone_number?: string;
  display_name?: string;
}

export interface IBeneficiaryData {
  beneficiaryType: string;
  insurance: string;
  healthPlanCode: string;
  healthPlanName: string;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  cpf: string;
  fullName: string;
  birthDate: Date;
  gender: string;
  company: string;
  holderCPF: string;
}

export interface IBeneficiaryRegistered {
  healthPlanCode: string;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  cpf: string;
  name: string;
  birthDate: Date;
  gender: string;
  holderCPF: string;
  companyId: number;
  insurerId: number;
  healthPlanId: number;
  beneficiaryTypeId: number;
}

export interface IBeneficiaryToUpdate {
  id: string;
  healthPlanCode: string;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  cpf: string;
  name: string;
  birthDate: Date;
  gender: string;
  holderCPF: string;
  companyId: number;
  insurerId: number;
  healthPlanId: number;
  beneficiaryTypeId: number;
}

export interface IHealthPlan {
  id: number;
  insurer_id: number;
  name: string;
  health_plan_code: string;
  status_id: number;
}

export interface ICompany {
  id: number;
  name: string;
  holder_name: string;
  holder_id: number;
}

export interface IRegisterCheckResult {
  totalSuccess: number;
  updateSuccess: number;
  createSuccess: number;
  totalErrors: number;
  requestErrors: IBeneficiaryData[];
  dbErrors: number;
}

export interface IBeneficiaryHistory {
  id: number;
  beneficiary_id: string;
  date: Date;
  action: string;
  status_id: number;
}
