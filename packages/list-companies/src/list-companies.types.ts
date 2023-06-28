import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export interface IListCompaniesParams {
  tracingId: string;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
}

export interface IListCompaniesFindParams {
  tracingId: string;
}

export interface IListCompanies {
  items: Array<ICompany>;
}

export interface ICompany {
  id: number;
  name: string;
  holder_name: string;
  holder_id: number;
}
