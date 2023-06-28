import { IHealthPlan } from "../repository/health-plan/health-plan.types";

export const getHeathPlanInfoByCodeOrName = (
  healthPlans: IHealthPlan[],
  code: string,
  name: string
): IHealthPlan | undefined => {
  if (!healthPlans) return undefined;

  return healthPlans?.find(
    (plan) =>
      plan.health_plan_code.equalsIgnoreCase(code ?? "") ||
      plan.name.equalsIgnoreCase(name ?? "")
  );
};

export const getHeathPlanInfoById = (
  healthPlans: IHealthPlan[],
  id: number
): IHealthPlan | undefined => {
  if (!healthPlans) return undefined;

  return healthPlans?.find((plan) => plan.id == id);
};
