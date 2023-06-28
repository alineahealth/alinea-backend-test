import { Pool, QueryConfig } from "pg";
import { pool } from "../../database";
import { IProcessCreateParams } from "./process.types";

export const createProcess = async (
  input: IProcessCreateParams
): Promise<boolean> => {
  const dbPool: Pool = pool();
  const { process } = input;
  let hasSuccess = false;
  let client;

  try {
    const command: QueryConfig = {
      text: `
        INSERT INTO processings (
          id,
          bucket_name,
          file_name,
          processing_type,
          file_extension,
          competence_date,
          processed_by,
          company_id,
          insurer_id,
          current_status,
          total_rows
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
      `,
      values: [
        process.id,
        process.bucketName,
        process.fileName,
        process.processingType,
        process.fileExtension,
        process.competenceDate,
        process.processedBy,
        process.companyId,
        process.insurerId,
        process.currentStatus,
        process.totalRows,
      ],
    };

    console.info({
      message: `Inserting process record.`,
      data: { command },
    });

    client = await dbPool.connect();
    const result = await client.query(command);

    hasSuccess = result.rowCount > 0;

    console.info({
      success: `${result.rowCount} process inserted successfully.`,
    });

    return hasSuccess;
  } catch (error) {
    console.error(`Error inserting process:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
