export interface IProcessCreateParams {
  process: IProcessCreate;
}

export interface IProcessUpdateParams {
  process: IProcessUpdate;
}

export interface IProcess {
  id: string;
  currentStatus: string;
  failedRows: number;
}

export interface IProcessCreate extends IProcess {
  bucketName: string;
  fileName: string;
  processingType: string;
  fileExtension: string;
  competenceDate?: Date;
  processedBy?: string;
  companyId?: number;
  insurerId?: number;
  totalRows: number;
}

export interface IProcessUpdate extends IProcess {
  updatedAt: Date;
  updatedRows: number;
}
