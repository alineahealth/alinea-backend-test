import { pool } from "../database";
import { IHealthPlan, IHealthPlanParams } from "./health-plan.types";

export const getHealthPlansByInsurerIdAsync = async (
  input: IHealthPlanParams
): Promise<IHealthPlan[]> => {
  const dbPool = pool();
  const { insurerId } = input;
  let client;

  try {
    const query = `SELECT * FROM health_plans WHERE insurer_id = $1`;
    const values = [insurerId];

    console.info({
      message: `Searching health plans information through SQL query, filtered by insurer_id ${insurerId}.`,
      data: { query },
    });

    client = await dbPool.connect();
    const { rows: plans } = await client.query(query, values);

    return plans;
  } catch (error) {
    console.error(
      `Error querying health plan information by id - ${insurerId}:`,
      error
    );
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
