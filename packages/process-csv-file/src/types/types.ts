import {
  IBeneficiaryToActivate,
  IBeneficiaryToCreate,
} from "../repository/beneficiaries/beneficiaries.types";

export interface IBeneficiary {
  beneficiaryType: string;
  planCode: string;
  planName: string;
  cardNumber: string;
  holderCardNumber: string;
  cpf: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  cpfHolder: string;
}

export interface ICsvStaticFields {
  processingType: string;
  competenceDate: string;
  companyId: string;
  insurerId: string;
  processedBy: string;
}

interface IRow {
  number: number;
  raw: string;
}

export interface IRowWithError extends IRow {
  errors: string[];
}

export interface IRowWithoutError extends IRow {
  processedRow: IBeneficiary;
}

export interface ProcessDataResult {
  staticFields: ICsvStaticFields;
  rows: ProcessedRow<IBeneficiary>[];
}

export interface ProcessedRow<T> {
  number: number;
  raw: string;
  parsedRow: T;
}

export const mapValuesCallback = (chunk: any): IBeneficiary => {
  return {
    beneficiaryType: chunk["0"]?.isNotNullOrEmpty() ? undefined : chunk["0"],
    planCode: chunk["1"]?.isNotNullOrEmpty() ? undefined : chunk["1"],
    planName: chunk["2"]?.isNotNullOrEmpty() ? undefined : chunk["2"],
    cardNumber: chunk["3"]?.isNotNullOrEmpty() ? undefined : chunk["3"],
    holderCardNumber: chunk["4"]?.isNotNullOrEmpty() ? undefined : chunk["4"],
    cpf: chunk["5"]?.isNotNullOrEmpty() ? undefined : chunk["5"],
    fullName: chunk["6"]?.isNotNullOrEmpty() ? undefined : chunk["6"],
    dateOfBirth: chunk["7"]?.isNotNullOrEmpty() ? undefined : chunk["7"],
    gender: chunk["8"]?.isNotNullOrEmpty() ? undefined : chunk["8"],
    email: chunk["9"]?.isNotNullOrEmpty() ? undefined : chunk["9"],
    cpfHolder: chunk["10"]?.isNotNullOrEmpty() ? undefined : chunk["10"],
  };
};

export const mapHeadersCallback = (chunk: any): ICsvStaticFields => {
  return {
    processingType: chunk["0"],
    competenceDate: chunk["1"],
    companyId: chunk["2"],
    insurerId: chunk["3"],
    processedBy: chunk["4"],
  };
};

export interface IMinorDependentBeneficiaryToActivate {
  parsed: IRowWithoutError;
  created: IBeneficiaryToCreate;
  holder?: IBeneficiaryToActivate | undefined;
}

export interface FileInformation {
  fileStream: any;
  fileName: string;
  extension: string;
  bucketName: string;
}

export interface QueryResult {
  success: IRowWithoutError[];
  errors: IRowWithError[];
}
