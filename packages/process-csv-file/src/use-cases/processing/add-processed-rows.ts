import { randomUUID } from "crypto";
import { IRowWithError } from "../../types/types";
import { IProcessedRowCreate } from "../../repository/processings/processed-row/processed-row.types";
import { createProcessedRowsAsync } from "../../repository/processings/processed-row/processed-row";

export const addProcessedRowsAsync = async (
  processingId: string,
  type: string,
  rowsToProcess: IRowWithError[]
): Promise<void> => {
  if (!rowsToProcess || rowsToProcess.length === 0) {
    console.warn({
      message: `No rows to process`,
    });
    return;
  }

  const rows: IProcessedRowCreate[] = rowsToProcess.map((row) => ({
    id: randomUUID(),
    processId: processingId,
    rawNumber: row.number,
    rawContent: row.raw,
    rowType: type,
    errorReasons: row.errors,
  }));

  await createProcessedRowsAsync({
    processedRows: rows,
  });
};
