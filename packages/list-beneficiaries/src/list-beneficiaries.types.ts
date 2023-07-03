import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export interface IListBeneficiariesParams {
  tracingID: number;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
}

export interface IListBeneficiariesFindParams {
  tracingID: string;
  page?: number;
  name?: string;
  itemsPerPage?: number;
  cpf: string;
}

export interface IListBeneriaries {
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  items: Array<IBeneficiary>;
}

export interface IBeneficiary {
  id: string;
  companyId: number;
  healthPlanCardId: string;
  holderHealthPlanCardId: string;
  beneficiaryTypeId: number;
  name: string;
  cpf: string;
  birthDate: Date;
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
