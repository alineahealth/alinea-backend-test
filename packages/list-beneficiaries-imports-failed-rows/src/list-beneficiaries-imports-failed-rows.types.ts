import {
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventPathParameters
} from "aws-lambda";
export interface IListBeneficiariesImportsFailedRowsFindParams {
  itemsPerPage?: number;
  page?: number;
  tracingID: string;
  processId: string;
}

export interface IListBeneficiariesImportsFailedRowsParams {
  tracingID: string;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
  pathParameters: APIGatewayProxyEventPathParameters | null;
}

export interface IListBeneficiariesImportsFailedRowsFind {
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  items: Array<IFailedRows>;
}

export interface IFailedRows {
  row_content: string;
}
export interface IListBeneficiariesImportsFailedRows {
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  items: Array<IFailedRows>;
}
