export interface IListInsurersParams {
  tracingId: string;
}

export interface IListInsurers {
  items: Array<Insurer>;
}

export interface Insurer {
  id: number;
  name: string;
}
