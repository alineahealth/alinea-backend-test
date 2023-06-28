import {
  IListBeneficiariesData,
  IListBeneficiariesToActivate,
} from "./beneficiaries.types";
import { pool } from "../database";

export const listBeneficiariesByCompanyAndCpfs = async (
  companyId: number,
  cpfs: string[]
): Promise<IListBeneficiariesData> => {
  const dbPool = pool();
  let client;

  try {
    const query = `SELECT * FROM beneficiaries
                            WHERE deleted_at IS NULL AND
                                  company_id = $1 AND
                                  cpf = ANY($2::text[])`;
    const values = [companyId, cpfs];

    console.info({
      message:
        "Searching beneficiaries information through SQL query, filtered by deleted_at, company_id and cpfs.",
      data: { query },
    });

    client = await dbPool.connect();
    const { rows: beneficiaries } = await client.query(query, values);

    return {
      items: beneficiaries,
    };
  } catch (error) {
    console.error(`Error querying beneficiaries:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};

export const listBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms = async (
  companyId: number,
  cpfs: string[]
): Promise<IListBeneficiariesToActivate> => {
  const dbPool = pool();
  let client;

  try {
    const query = `SELECT *
                  FROM beneficiaries
                  WHERE deleted_at IS NULL AND
                        company_id = $1 AND
                        accepted_terms_at IS NOT NULL AND
                        cpf = ANY($2::text[])`;
    const values = [companyId, cpfs];

    console.info({
      message:
        "Searching beneficiaries information through SQL query, filtered by deleted_at, company_id, cpfs and accepted terms",
      data: { query },
    });

    client = await dbPool.connect();
    const { rows: beneficiaries } = await client.query(query, values);

    return {
      items: beneficiaries,
    };
  } catch (error) {
    console.error(`Error querying beneficiaries:`, error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await dbPool.end();
  }
};
