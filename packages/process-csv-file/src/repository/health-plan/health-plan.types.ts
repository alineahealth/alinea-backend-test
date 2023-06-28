export interface IHealthPlan {
  id: number;
  insurer_id: number;
  name: string;
  health_plan_code: string;
  status_id: number;
}

export interface IHealthPlanParams {
  insurerId: number;
}
