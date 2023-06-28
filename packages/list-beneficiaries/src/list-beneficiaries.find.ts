import {
  IListBeneficiariesFindParams,
  IListBeneriaries,
} from "./list-beneficiaries.types";
import { pool } from "./database";

export const listBeneficiariesFind = async ({
  name = "",
  cpf = "",
  itemsPerPage = 10,
  page = 1,
  tracingID,
}: IListBeneficiariesFindParams): Promise<IListBeneriaries> => {
  let query = `SELECT * FROM beneficiaries where deleted_at is null`;
  const offset = itemsPerPage * (page - 1);
  const countQuery = `SELECT count(*) total FROM beneficiaries where deleted_at is null`;
  const dbPool = pool();

  if (name) {
    query = query + ` and name like '%${name}%'`;
  }

  if (cpf) {
    query = query + ` or cpf = ${cpf}`;
  }

  query = query + ` order by name offset ${offset} limit ${itemsPerPage}`;

  console.info({
    tracingID,
    message: "Select beneficiaries SQL queries",
    data: {
      query,
      countQuery,
    },
  });

  const client = await dbPool.connect();
  const { rows: beneficiaries } = await client.query(query);
  const {
    rows: [{ total: totalItems }],
  } = await client.query(countQuery);

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    itemsPerPage,
    items: beneficiaries,
  };
};
