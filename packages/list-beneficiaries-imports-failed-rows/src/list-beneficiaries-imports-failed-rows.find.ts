import { pool } from "./database";
import {
  IListBeneficiariesImportsFailedRowsFind,
  IListBeneficiariesImportsFailedRowsFindParams,
} from "./list-beneficiaries-imports-failed-rows.types";

export const listBeneficiariesImportsFailedRowsFind = async ({
  processId,
  itemsPerPage = 10,
  page = 1,
  tracingID,
}: IListBeneficiariesImportsFailedRowsFindParams): Promise<IListBeneficiariesImportsFailedRowsFind> => {
  const dbPool = pool();
  const offset = itemsPerPage * (page - 1);
  const resultQuery = `
    SELECT raw_content
    FROM (
      SELECT raw_content, 'processed_rows' as source
      FROM processed_rows
      WHERE process_id = $1
      UNION ALL
      SELECT raw_content, 'processing_schema_errors' as source
      FROM processing_schema_errors
      WHERE process_id = $1
    ) AS data
    ORDER BY source
    OFFSET $2 LIMIT $3;
  `;
  const countQuery = `
    SELECT COUNT(raw_content) as total
    FROM (
      SELECT raw_content
      FROM processed_rows
      WHERE process_id = $1
      UNION ALL
      SELECT raw_content
      FROM processing_schema_errors
      WHERE process_id = $1
    ) AS data;
  `;
  console.info({
    tracingID,
    message: "Select beneficiaries imports failed rows SQL queries",
    data: {
      resultQuery,
      countQuery,
    },
  });

  const client = await dbPool.connect();
  const { rows: failedRows } = await client.query(resultQuery, [processId, offset, itemsPerPage]);
  const {
    rows: [{ total: totalItems }],
  } = await client.query(countQuery, [processId]);

  return {
    totalItems: Number(totalItems),
    totalPages: Math.ceil(totalItems / itemsPerPage),
    itemsPerPage,
    items: failedRows,
  };
};


