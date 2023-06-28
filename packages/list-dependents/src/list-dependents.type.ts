import { APIGatewayProxyEventPathParameters } from "aws-lambda";

export interface IListHolderParams {
  tracingID: string;
  cpf: string;
}

export interface IListDependentsParams {
  tracingID: string;
  pathParameters: APIGatewayProxyEventPathParameters;
}

export interface IListDependentsFindParams {
  tracingID: string;
  cpf: string;
}

export interface IGetPlanFindOneParams {
  tracingID: string;
  healthPlanID: string;
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
  updateAt?: Date;
  deletedAt?: Date;
  acceptedIermsAt?: Date;
  phoneNumber: string;
  displayName: string;
}

export interface IDependent {
  name: string, 
  CPF: string,
  birthDate: string, 
  healthPlanCardId: string,
  active: boolean,
  healthPlan: IhealthPlan,
}

export interface IhealthPlan { 
  insurerName: string, 
  healthPlanId: string, 
  healthPlanName: string
}
