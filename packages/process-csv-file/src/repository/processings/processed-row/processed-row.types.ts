export interface IProcessedRowCreateParams {
  processedRows: IProcessedRowCreate[];
}

export interface IProcessedRowCreate {
  id: string;
  processId: string;
  rawNumber: number;
  rawContent: string;
  rowType: string;
  updatedReasons?: string[];
  errorReasons: string[];
}
