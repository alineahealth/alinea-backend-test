import { QueryConfig } from "pg";
import { pool } from "../database";
import { IBeneficiariesHistoriesParams } from "./beneficiaries.types";
import { generateInsertValues } from "../../utils/database-helpers";

export const createBeneficiariesHistory = async (
  input: IBeneficiariesHistoriesParams,
  historyDate: Date = new Date()
): Promise<boolean> => {
  const dbPool = pool();
  const { beneficiaries } = input;
  let client;

  try {
    const values: any[][] = beneficiaries.map((beneficiary) => [
      beneficiary.beneficiary_id,
      historyDate,
      beneficiary.action,
      beneficiary.status_id,
    ]);

    const columns = ["beneficiary_id", "date", "action", "status_id"];
    const insertValues = generateInsertValues(
      "beneficiaries_history",
      columns,
      values
    );

    const command: QueryConfig = {
      text: insertValues.text,
      values: insertValues.values,
    };

    console.info({
      message: `Inserting beneficiaries histories records.`,
      data: { command },
    });

    client = await dbPool.connect();
    await client.query("BEGIN");
    const result = await client.query(command);
    if (result.rowCount !== beneficiaries.length) {
      await client.query("ROLLBACK");
      throw new Error(
        `Error inserting beneficiaries histories. Expected ${beneficiaries.length} rows to be inserted but ${result.rowCount} were inserted.`
      );
    }

    await client.query("COMMIT");

    console.info({
      success: `${result.rowCount} beneficiaries histories inserted successfully.`,
    });

    return true;
  } catch (error) {
    console.error(`Error inserting beneficiaries histories:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
