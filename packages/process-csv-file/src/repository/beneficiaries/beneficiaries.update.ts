import { Pool, QueryConfig } from "pg";
import { pool } from "../database";
import {
  IBeneficiaryDatabase,
  IBeneficiaryUpdateParams,
} from "./beneficiaries.types";

export const updateBeneficiaries = async (
  input: IBeneficiaryUpdateParams
): Promise<IBeneficiaryDatabase[]> => {
  const dbPool: Pool = pool();
  const { beneficiaries } = input;
  let client;

  try {
    const values: any[][] = beneficiaries.map((beneficiary) => [
      beneficiary.id,
      beneficiary.healthPlanId,
      beneficiary.healthPlanCardId,
      beneficiary.holderHealthPlanCardId,
      beneficiary.updatedAt,
    ]);

    const command: QueryConfig = {
      text: `
        UPDATE beneficiaries AS b
        SET 
          health_plan_id = d.health_plan_id,
          health_plan_card_id = d.health_plan_card_id,
          holder_health_plan_card_id = d.holder_health_plan_card_id,
          updated_at = d.updated_at
        FROM unnest($1::uuid[], $2::int4[], $3::text[], $4::text[], $5::timestamp[]) AS d(key, health_plan_id, health_plan_card_id, holder_health_plan_card_id, updated_at)
        WHERE b.id = d.key AND d.key = ANY($1::uuid[])
        RETURNING b.*
      `,
      values: [
        values.map((beneficiary) => beneficiary[0]),
        values.map((beneficiary) => beneficiary[1]),
        values.map((beneficiary) => beneficiary[2]),
        values.map((beneficiary) => beneficiary[3]),
        values.map((beneficiary) => beneficiary[4]),
      ],
    };

    console.info({
      message: `Updating beneficiaries records.`,
      data: { command },
    });

    client = await dbPool.connect();

    await client.query("BEGIN");
    const result = await client.query(command);
    await client.query("COMMIT");

    console.info({
      success: `${result.rowCount} beneficiaries updated successfully.`,
    });

    return result.rows;
  } catch (error) {
    console.error(`Error updating beneficiaries:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
