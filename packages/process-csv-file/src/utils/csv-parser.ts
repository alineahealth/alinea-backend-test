import csv from "csv-parser";
import { Writable, Readable } from "stream";
import {
  ProcessDataResult,
  ProcessedRow,
  mapValuesCallback,
  mapHeadersCallback,
  ICsvStaticFields,
  IBeneficiary,
} from "../types/types";

export const parseCsvFileToObject = (
  tracingId: string,
  fileStream: Readable,
  batchSize: number
): Promise<ProcessDataResult> => {
  return new Promise((resolve, reject) => {
    const batch: any[] = [];
    const processedRows: ProcessedRow<IBeneficiary>[] = [];
    let staticFields: ICsvStaticFields;

    let number = 1;

    const transformToObject = csv({
      separator: ",",
      headers: false,
      skipLines: 1,
    });

    const writableStreamFile = new Writable({
      objectMode: true,
      write(chunk, _, next) {
        const chunkString = Object.values(chunk).join(",");
        const lastCharacter = chunkString.slice(-1);

        const raw =
          lastCharacter === "," ? chunkString.slice(0, -1) : chunkString;

        if (number === 1) {
          const header = mapHeadersCallback(chunk);
          staticFields = header;
        }

        if (number > 3) {
          const parsedRow = mapValuesCallback(chunk) as IBeneficiary;
          processedRows.push({ number, raw, parsedRow });

          batch.push(chunkString);

          if (batch.length >= batchSize) {
            batch.length = 0; // Clear the batch
          }
        }
        number++;
        next();
      },
    });

    fileStream
      .pipe(transformToObject)
      .pipe(writableStreamFile)
      .on("finish", () => {
        const result: ProcessDataResult = {
          rows: processedRows,
          staticFields: staticFields,
        };
        resolve(result);
      })
      .on("error", (error) => {
        console.error(
          `${tracingId} - An error occurred during processing:`,
          error
        );
        reject({
          success: false,
          message: `${tracingId} - An error occurred during processing`,
          error,
        });
      });
  });
};
