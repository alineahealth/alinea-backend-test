import { pool } from "./database";
import { IBeneficiary, IBeneficiaryHistory, ICompany, ICreateBeneficiary, IHealthPlan } from "./put-many-beneficiaries.type";

export const findCPFsInDatabase = async (data: ICreateBeneficiary, tracingID: string):Promise <IBeneficiary> => {
  const dbPool = pool();
  const client = await dbPool.connect();
  const query =
  "SELECT * FROM beneficiaries WHERE cpf = $1 and company_id = $2 and deleted_at is null";
  const values = [data.cpf, data.companyId];
  const result = await client.query(query, values);
  console.info({
    tracingID,
    message: "Check existent beneficiaries with their CPFs and companyID",
    data: result.rows[0],
  });
  
  return result.rows[0];
}

export const listPlans = async (): Promise<IHealthPlan[]> => { 
  const dbPool = pool();
  const client = await dbPool.connect();
  const query = `SELECT * FROM health_plans`;
  const { rows: plans } = await client.query(query); 
  return plans;
}

export const listCompanies = async (): Promise<ICompany[]> => { 
  const dbPool = pool();
  const client = await dbPool.connect();
  const query = `SELECT * FROM companies`;
  const { rows: companies } = await client.query(query); 
  return companies;
}

export const updateBeneficiaries = async (data:IBeneficiary, tracingID: string)=> { 
  const dbPool = pool();
  const client = await dbPool.connect();

 const today = new Date();
 
 const query = "UPDATE beneficiaries SET health_plan_id = $2, updated_at = $3, health_plan_card_id = $4, holder_health_plan_card_id = $5 WHERE cpf = $1";
 
 const { rows } = await client.query(query, [data.cpf, data.health_plan_id, today, data.health_plan_card_id, data.holder_health_plan_card_id]);
 
 console.info({
   tracingID,
   message: `${data.cpf} Beneficiary updated`,
   data: {
     healthPlanId: data.health_plan_id,
     updatedAt: today,
     healthPlanCardId: data.health_plan_card_id,
     holder_health_plan_card_id: data.holder_health_plan_card_id
   }
 });
 
 return rows;
}

export const createBeneficiaries = async (data: ICreateBeneficiary, id: string, tracingID: string): Promise<IBeneficiary[]> => { 
  const dbPool = pool();
  const client = await dbPool.connect();
  const today = new Date();

  const query = `
    INSERT INTO beneficiaries (id, company_id, cpf, health_plan_card_id, beneficiary_type_id, name, birth_date, health_plan_id, status_id, gender, created_at)
    VALUES (${data.companyId}, ${data.cpf}, ${data.healthPlanCardId}, ${data.beneficiaryTypeId}, ${data.name}, ${data.birthDate}, ${data.healthPlanId}, 1, ${data.gender}, ${today})`

  const values = [id, data.companyId, data.cpf, data.healthPlanCardId, data.beneficiaryTypeId, data.name, data.birthDate, data.healthPlanId, 1, data.gender, today];
  try {
    const {rows} = await client.query(query, values);
    console.info({
      tracingID,
      message: `${id} Beneficiaries created with cpf: ${data.cpf}`,
    });
    return rows;
  } catch (e) {
    throw new Error(`Error creating beneficiary into db: ${e}`);
  }
}

export const changeBeneficiaryHistory = async(
  data: Partial<IBeneficiaryHistory>,
  tracingID: string,
): Promise<string> => {
  const dbPool = pool();
  const client = await dbPool.connect();

 const today = new Date();
  const query =
    "INSERT INTO beneficiaries_history(beneficiary_id, date, action, status_id) VALUES($1, $2, $3, $4)";
  const values = [
    data.beneficiary_id,
    today,
    data.action,
    1,
  ];

  try {
    await client.query(query, values);
    return `Beneficiary history changed with update information tracingID: ${tracingID}`;
  } catch (e) {
    throw new Error(`Error creating beneficiary into db: ${e}`);
  }
}