import { pool } from "./database";
import {
  IListCompanies,
  IListCompaniesFindParams,
} from "./list-companies.types";

export const getAllCompanies = async (
  input: IListCompaniesFindParams
): Promise<IListCompanies> => {
  const dbPool = pool();
  const { tracingId } = input;
  let client;

  try {
    const query = `SELECT id, name FROM companies`;

    console.info({
      tracingId,
      message: `Selecting companies information through SQL queries.`,
      data: { query },
    });

    client = await dbPool.connect();

    const { rows } = await client.query(query);

    return {
      items: rows,
    };
  } catch (error) {
    console.error(`${tracingId} - Error querying companies:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
