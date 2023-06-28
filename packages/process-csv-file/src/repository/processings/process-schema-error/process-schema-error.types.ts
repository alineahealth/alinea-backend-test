export interface IProcessSchemaErrorCreateParams {
  processSchemaError: IProcessSchemaErrorCreate[];
}

export interface IProcessSchemaErrorCreate {
  id: string;
  processId: string;
  rawContent: string;
  errorReasons: string[];
}
