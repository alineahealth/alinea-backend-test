import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export interface IListBeneficiariesImportsResultParams {
  itemsPerPage: number;
  page: number;
  tracingID: string;
}
export interface IListBeneficiariesParams {
  tracingID: string;
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null;
}

export interface IListBeneficiariesImportsResult {
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
  items: Array<IBeneficiariesImportResult>;
}

export interface IBeneficiariesImportDBResult {
  id: string;
  bucket_name: string;
  file_name: string;
  file_extension: string;
  competence_date: Date;
  processed_by: string;
  processing_type: string;
  company_id: number;
  insurer_id: number;
  current_status: string;
  total_rows: number;
  updated_rows: number;
  failed_rows: number;
  created_at: Date;
  updated_at: Date;
}

export interface IBeneficiariesImportResult {
  id: string;
  bucketName: string;
  fileName: string;
  fileExtension: string;
  competenceDate: Date;
  processedBy: string;
  companyId: number;
  insurerId: number;
  currentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  totalRows: number;
  updatedRows: number;
  failedRows: number;
}