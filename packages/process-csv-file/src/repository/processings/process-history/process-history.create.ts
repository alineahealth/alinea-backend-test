import { Pool, QueryConfig } from "pg";
import { pool } from "../../database";
import { IProcessHistoryCreateParams } from "./process-history.types";

export const createProcessHistory = async (
  input: IProcessHistoryCreateParams
): Promise<boolean> => {
  const dbPool: Pool = pool();
  const { processHistory } = input;
  let hasSuccess = false;
  let client;

  try {
    const command: QueryConfig = {
      text: `
        INSERT INTO processing_history (id, process_id, status_id)
        VALUES ($1, $2, $3)
      `,
      values: [
        processHistory.id,
        processHistory.processId,
        processHistory.statusId,
      ],
    };

    console.info({
      message: `Inserting process history record.`,
      data: { command },
    });

    client = await dbPool.connect();
    const result = await client.query(command);

    hasSuccess = result.rowCount > 0;

    console.info({
      success: `${result.rowCount} process history inserted successfully.`,
    });

    return hasSuccess;
  } catch (error) {
    console.error(`Error inserting process history:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
