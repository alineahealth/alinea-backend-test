import {
  IBeneficiaryData,
  IBeneficiaryRegistered,
  ICompany,
  IHealthPlan,
} from "./put-many-beneficiaries.type";

export const attributesValidation = (data: IBeneficiaryData[]) => {
  const attributes: string[] = [
    "beneficiaryType",
    "insurance",
    "healthPlanCode",
    "healthPlanName",
    "healthPlanCardId",
    "holderHealthPlanCardId",
    "cpf",
    "fullName",
    "birthDate",
    "company",
  ];
  const failedRequest: IBeneficiaryData[] = [];
  const goodRequest: IBeneficiaryData[] = [];

  for (const person of data) {
    const keys = Object.keys(person);
    const values = Object.values(person);
    const hasAllAttributes = attributes.every(
      (att) => keys.includes(att),
      !values.includes("null" || undefined)
    );
    if (hasAllAttributes) {
      goodRequest.push(person);
    } else {
      failedRequest.push(person);
    }
  }
  return { goodRequest, failedRequest };
};

export const dataDBValidation = (
  plans: IHealthPlan[],
  companies: ICompany[]
) => {
  if (plans.length === 0) {
    throw new Error(`Health_plans not found in database`);
  }

  // valid if has companies to use
  if (companies.length === 0) {
    throw new Error(`Companies not found in database`);
  }
};

export const checkRegister = async (
  data: IBeneficiaryData[],
  companies: ICompany[],
  plans: IHealthPlan[]
): Promise<IBeneficiaryRegistered[]> => {
  let selectedPlan: IHealthPlan;

  const result = await Promise.all(
    data.map((person) => {
      const companyObj = companies.find(
        (c) => c.name.toLowerCase() === person.company.toLowerCase()
      );
      const planByName = plans.find(
        (c) =>
          c.name.toLowerCase() === person.healthPlanName.toLowerCase() ||
          c.health_plan_code.toLowerCase() ===
            person.healthPlanCode.toLowerCase()
      );

      if(planByName !== undefined) {
        selectedPlan = planByName;
      } else {
        const planByCode = plans.find(
          (c) =>
            c.health_plan_code.toLowerCase() ===
              person.healthPlanCode.toLowerCase()
        );
        planByCode ? selectedPlan = planByCode : undefined;
      }

      const {
        healthPlanCode,
        healthPlanCardId,
        holderHealthPlanCardId,
        cpf,
        fullName,
        birthDate,
        gender,
        holderCPF,
      } = person;

      return {
        healthPlanCode,
        healthPlanCardId,
        holderHealthPlanCardId,
        cpf,
        name: fullName,
        birthDate,
        gender,
        holderCPF,
        companyId: companyObj !== undefined? companyObj.id: 0,
        insurerId: selectedPlan !== undefined? selectedPlan.insurer_id: 0,
        healthPlanId: selectedPlan !== undefined? selectedPlan.id: 0,
        beneficiaryTypeId:
          person.beneficiaryType.toLowerCase() === "TITULAR" ? 1 : 2,
      };
    })
  );
  return result;
};
