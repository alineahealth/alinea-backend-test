import { Pool, QueryConfig } from "pg";
import { pool } from "../../database";
import { IProcessSchemaErrorCreateParams } from "./process-schema-error.types";
import { generateInsertValues } from "../../../utils/database-helpers";

export const createProcessSchemaError = async (
  input: IProcessSchemaErrorCreateParams
): Promise<boolean> => {
  const dbPool: Pool = pool();
  const { processSchemaError } = input;
  let client;

  try {
    const values: any[][] = processSchemaError.map((error) => [
      error.id,
      error.processId,
      error.rawContent,
      error.errorReasons,
    ]);

    const columns = ["id", "process_id", "raw_content", "error_reasons"];
    const insertValues = generateInsertValues(
      "processing_schema_errors",
      columns,
      values
    );

    const command: QueryConfig = {
      text: insertValues.text,
      values: insertValues.values,
    };

    console.log(command);

    client = await dbPool.connect();
    await client.query("BEGIN");
    const result = await client.query(command);

    if (result.rowCount !== processSchemaError.length) {
      await client.query("ROLLBACK");
      throw new Error(
        `Error inserting schema errors. Expected ${processSchemaError.length} rows to be inserted but ${result.rowCount} were inserted.`
      );
    }

    await client.query("COMMIT");

    console.info({
      success: `${result.rowCount} schema errors inserted successfully.`,
    });

    return true;
  } catch (error) {
    console.error(`Error inserting schema errors:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
