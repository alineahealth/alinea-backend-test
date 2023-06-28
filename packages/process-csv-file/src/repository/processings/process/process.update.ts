import { Pool, QueryConfig } from "pg";
import { pool } from "../../database";
import { IProcessUpdateParams } from "./process.types";

export const updateProcess = async (
  input: IProcessUpdateParams
): Promise<boolean> => {
  const dbPool: Pool = pool();
  const { process } = input;
  let hasSuccess = false;
  let client;

  try {
    const command: QueryConfig = {
      text: `
        UPDATE processings
        SET current_status = $2,
            updated_rows = $3,
            failed_rows = $4,
            updated_at = NOW() AT TIME ZONE 'UTC'
        WHERE id = $1
      `,
      values: [
        process.id,
        process.currentStatus,
        process.updatedRows,
        process.failedRows,
      ],
    };

    console.info({
      message: `Updating process record.`,
      data: { command },
    });

    client = await dbPool.connect();
    const result = await client.query(command);

    hasSuccess = result.rowCount > 0;

    console.info({
      success: `${result.rowCount} process updated successfully.`,
    });

    return hasSuccess;
  } catch (error) {
    console.error(`Error updating process:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
