import { IHealthPlan } from "../src/put-many-beneficiaries.type";

export const mockHealthPlans: IHealthPlan[] = [
  { id: 1, name: "Plan A", insurer_id: 1, status_id: 1, health_plan_code: "A1" },
  { id: 2, name: "Plan B", insurer_id: 2, status_id: 1, health_plan_code: "B2" },
];