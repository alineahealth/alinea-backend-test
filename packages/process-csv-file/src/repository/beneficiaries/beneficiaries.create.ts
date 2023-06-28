import { QueryConfig } from "pg";
import { pool } from "../database";
import { IBeneficiaryCreateParams } from "./beneficiaries.types";
import { generateInsertValues } from "../../utils/database-helpers";

export const createBeneficiaries = async (
  input: IBeneficiaryCreateParams,
  date: Date = new Date()
): Promise<boolean> => {
  const dbPool = pool();
  const { beneficiaries } = input;
  let client;

  try {
    const values: any[][] = beneficiaries.map((beneficiary) => [
      beneficiary.id,
      beneficiary.companyId,
      beneficiary.cpf,
      beneficiary.healthPlanCardId,
      beneficiary.holderHealthPlanCardId,
      beneficiary.beneficiaryTypeId,
      beneficiary.name,
      beneficiary.birthDate,
      beneficiary.healthPlanId,
      beneficiary.statusId,
      beneficiary.gender,
      beneficiary.holderCpf,
      date,
    ]);

    const columns = [
      "id",
      "company_id",
      "cpf",
      "health_plan_card_id",
      "holder_health_plan_card_id",
      "beneficiary_type_id",
      "name",
      "birth_date",
      "health_plan_id",
      "status_id",
      "gender",
      "holder_cpf",
      "updated_at",
    ];
    const insertValues = generateInsertValues("beneficiaries", columns, values);

    const command: QueryConfig = {
      text: insertValues.text,
      values: insertValues.values,
    };

    console.info({
      message: `Inserting beneficiaries records.`,
      data: { command },
    });

    client = await dbPool.connect();
    await client.query("BEGIN");
    const result = await client.query(command);

    if (result.rowCount !== beneficiaries.length) {
      await client.query("ROLLBACK");
      throw new Error(
        `Error inserting beneficiaries. Expected ${beneficiaries.length} rows to be inserted but ${result.rowCount} were inserted.`
      );
    }

    await client.query("COMMIT");

    console.info({
      success: `${result.rowCount} beneficiaries inserted successfully.`,
    });

    return true;
  } catch (error) {
    console.error(`Error inserting beneficiaries:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
