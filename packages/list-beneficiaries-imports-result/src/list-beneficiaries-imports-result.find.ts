import { pool } from "./database";
import {
  IBeneficiariesImportDBResult,
  IListBeneficiariesImportsResult,
  IListBeneficiariesImportsResultParams,
} from "./list-beneficiaries-imports-result.types";

export const listBeneficiariesImportsResultFind = async ({
  itemsPerPage = 10,
  page = 1,
  tracingID,
}: IListBeneficiariesImportsResultParams): Promise<IListBeneficiariesImportsResult> => {
  const dbPool = pool();
  const offset = itemsPerPage * (page - 1);
  const resultQuery = 'SELECT * FROM processings order by created_at DESC offset $1 limit $2';
  const countQuery = `SELECT count(*) total FROM processings`;
  const values = [offset, itemsPerPage];

  console.info({
    tracingID,
    message: "Select beneficiaries imports SQL queries",
    data: {
      resultQuery,
      countQuery,
    },
  });

  const client = await dbPool.connect();
  const { rows: importsResult } = await client.query(resultQuery, values);
  const {
    rows: [{ total: totalItems }],
  } = await client.query(countQuery);

  return {
    meta: {
      currentPage: page,
      totalItems: Number(totalItems),
      totalPages: Math.ceil(totalItems / itemsPerPage),
      itemsPerPage,
    },
    items: importsResult.map(mapToCamelCase),
  };
};

export const mapToCamelCase = (processing: IBeneficiariesImportDBResult) => {
  return {
    id: processing.id,
    bucketName: processing.bucket_name,
    fileName: processing.file_name,
    fileExtension: processing.file_extension,
    competenceDate: processing.competence_date,
    processingType: processing.processing_type,
    processedBy: processing.processed_by,
    companyId: processing.company_id,
    insurerId: processing.insurer_id,
    currentStatus: processing.current_status,
    createdAt: processing.created_at,
    updatedAt: processing.updated_at,
    totalRows: processing.total_rows,
    updatedRows: processing.updated_rows,
    failedRows: processing.failed_rows,
  }
}
