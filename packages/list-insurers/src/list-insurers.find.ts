import { pool } from "./database";
import { IListInsurers, IListInsurersParams } from "./list-insurers.types";
export const getAllInsurersQueryAsync = async (
  input: IListInsurersParams
): Promise<IListInsurers> => {
  const dbPool = pool();
  const { tracingId } = input;
  let client;

  try {
    const query = `SELECT * FROM insurers`;

    console.info({
      tracingId,
      message: `Selecting insurers information through SQL queries.`,
      data: { query },
    });

    client = await dbPool.connect();

    const { rows } = await client.query(query);

    return {
      items: rows,
    };
  } catch (error) {
    console.error(`${tracingId} - Error querying insurers:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
