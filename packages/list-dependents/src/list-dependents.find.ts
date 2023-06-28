import { pool } from "./database";
import { IDependent, IListDependentsFindParams } from "./list-dependents.type";

export const listDependentsFind = async ({
  tracingID,
  cpf,
}: IListDependentsFindParams): Promise<IDependent[]> => {
  const dbPool = pool();
  const client = await dbPool.connect();
  const getHolderQuery = `SELECT * FROM beneficiaries where deleted_at is null and cpf = '${cpf}'`;
  const possibleHolders = await client.query(getHolderQuery);
  const holder = possibleHolders.rows[0];

  const getDependentsQuery = `SELECT b.name, b.cpf, b.birth_date, b.health_plan_card_id, b.accepted_terms_at, b.health_plan_id, i.name AS insurer_name, hp.name AS health_plan_name
  FROM beneficiaries b
  LEFT JOIN health_plans hp ON b.health_plan_id = hp.id
  LEFT JOIN insurers i ON hp.insurer_id = i.id
  WHERE b.holder_health_plan_card_id = '${holder.health_plan_card_id}' 
  AND b.deleted_at IS NULL
  AND b.holder_health_plan_card_id IS NOT NULL
  AND b.holder_health_plan_card_id <> '""'
  AND b.holder_health_plan_card_id <> ''''
  AND b.holder_health_plan_card_id <> ''`;

  console.info({
    tracingID,
    message: "Find dependents using holder_health_plan_card_id SQL query",
    data: {
      getDependentsQuery,
    },
  });

  const { rows: dependents } = await client.query(getDependentsQuery);

  const allDependents = dependents.map((dependent) => {
    return {
      name: dependent.name,
      CPF: dependent.cpf,
      birthDate: dependent.birth_date ?? "00000000",
      healthPlanCardId: dependent.health_plan_card_id,
      active: dependent.accepted_terms_at ? true : false,
      healthPlan: {
        insurerName: dependent.insurer_name,
        healthPlanId: dependent.health_plan_id,
        healthPlanName: dependent.health_plan_name,
      },
    };
  });
  return allDependents;
};
