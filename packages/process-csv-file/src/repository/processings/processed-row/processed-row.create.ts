import { Pool, QueryConfig } from "pg";
import { pool } from "../../database";
import { IProcessedRowCreateParams } from "./processed-row.types";
import { generateInsertValues } from "../../../utils/database-helpers";

export const createProcessedRows = async (
  input: IProcessedRowCreateParams
): Promise<boolean> => {
  const dbPool: Pool = pool();
  const { processedRows } = input;
  let client;

  try {
    const values: any[][] = processedRows.map((processedRow) => [
      processedRow.id,
      processedRow.processId,
      processedRow.rawNumber,
      processedRow.rawContent,
      processedRow.rowType,
      processedRow.updatedReasons,
      processedRow.errorReasons,
    ]);

    const columns = [
      "id",
      "process_id",
      "raw_number",
      "raw_content",
      "row_type",
      "update_reasons",
      "error_reasons",
    ];
    const insertValues = generateInsertValues(
      "processed_rows",
      columns,
      values
    );

    const command: QueryConfig = {
      text: insertValues.text,
      values: insertValues.values,
    };

    console.info({
      message: `Inserting processed rows records.`,
      data: { command },
    });

    client = await dbPool.connect();
    await client.query("BEGIN");
    const result = await client.query(command);

    if (result.rowCount !== processedRows.length) {
      await client.query("ROLLBACK");
      throw new Error(
        `Error inserting processed rows. Expected ${processedRows.length} rows to be inserted but ${result.rowCount} were inserted.`
      );
    }

    await client.query("COMMIT");

    console.info({
      success: `${result.rowCount} processed rows inserted successfully.`,
    });

    return true;
  } catch (error) {
    console.error(`Error inserting processed rows:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
