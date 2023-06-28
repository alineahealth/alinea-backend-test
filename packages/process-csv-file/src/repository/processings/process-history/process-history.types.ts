export interface IProcessHistoryCreateParams {
  processHistory: IProcessHistoryCreate;
}

export interface IProcessHistoryCreate {
  id: string;
  processId: string;
  statusId: number;
}
