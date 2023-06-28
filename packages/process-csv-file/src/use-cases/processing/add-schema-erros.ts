import { randomUUID } from "crypto";
import { IProcessSchemaErrorCreate } from "../../repository/processings/process-schema-error/process-schema-error.types";
import { createProcessSchemaErrorAsync } from "../../repository/processings/process-schema-error/process-schema-error";
import { IRowWithError } from "../../types/types";

export const addSchemaErrorsAsync = async (
  processId: string,
  rowWithErrors: IRowWithError[]
): Promise<void> => {
  if (!rowWithErrors || rowWithErrors.length === 0) {
    console.warn({
      message: `No rows with schema errors to process`,
    });
    return;
  }
  const errors: IProcessSchemaErrorCreate[] = rowWithErrors.map((row) => ({
    id: randomUUID(),
    processId: processId,
    rawContent: row.raw,
    errorReasons: row.errors,
  }));
  await createProcessSchemaErrorAsync({
    processSchemaError: errors,
  });
};
