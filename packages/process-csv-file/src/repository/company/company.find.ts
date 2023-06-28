import { pool } from "../database";
import { ICompany, ICompanyParams } from "./company.type";

export const getCompanyById = async (
  input: ICompanyParams
): Promise<ICompany> => {
  const dbPool = pool();
  const { companyId } = input;
  let client;

  try {
    const query = `SELECT id, name FROM companies WHERE id = $1`;
    const values = [companyId];

    console.info({
      message: `Searching company information through SQL query, filtered by ID ${companyId}.`,
      data: { query },
    });

    client = await dbPool.connect();
    const { rows } = await client.query(query, values);

    return rows?.[0];
  } catch (error) {
    console.error(`Error querying company by id - ${companyId}:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
