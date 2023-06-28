import { randomUUID } from "crypto";
import { Context, S3Event, S3Handler } from "aws-lambda";
import { getS3Object } from "./utils/s3-helper";
import { parseCsvFileToObject } from "./utils/csv-parser";
import { BeneficiaryValidateStaticFields } from "./validation/beneficiaries.validate";
import { BeneficiariesSchemaValidate } from "./validation/beneficiaries-schame.validate";
import { createProcessAsync } from "./use-cases/processing/create-process";
import { updateProcessInfoAsync } from "./use-cases/processing/update-process";
import { addSchemaErrorsAsync } from "./use-cases/processing/add-schema-erros";
import { addProcessedRowsAsync } from "./use-cases/processing/add-processed-rows";
import { processBeneficiaries } from "./use-cases/beneficiaries/get-beneficiaries";
import { createBeneficiaries } from "./use-cases/beneficiaries/create-beneficiaries";
import { updatedBeneficiary } from "./use-cases/beneficiaries/update-beneficiaries";
import { getCompanyByIdAsync } from "./repository/company/company";
import { Status } from "./enums/status.enum";
import { parseNumber, safeParseNumber } from "./utils/string-helpers";
import { ICsvStaticFields } from "./types/types";
import {
  IProcessCreate,
  IProcessUpdate,
} from "./repository/processings/process/process.types";
import { IHealthPlan } from "./repository/health-plan/health-plan.types";
import { ICompany } from "./repository/company/company.type";
import { getHealthPlansByInsurerIdAsync } from "./repository/health-plan/health-plan.find";
import { parseDateString } from "./utils/date-helpers";

export const handler: S3Handler = async (event: S3Event, context: Context) => {
  const tracingId = context.awsRequestId || randomUUID();
  const processingId = tracingId;
  const errorType = "ERROR";

  let healthPlans: IHealthPlan[];
  let company: ICompany;

  try {
    const { fileStream, fileName, extension, bucketName } = await getS3Object(
      tracingId,
      event.Records[0]
    );

    const batchSize = 1000;
    const { rows, staticFields } = await parseCsvFileToObject(
      tracingId,
      fileStream,
      batchSize
    );

    const {
      processingType,
      competenceDate,
      companyId,
      insurerId,
      processedBy,
    } = staticFields;

    const { schemaErrors } = new BeneficiaryValidateStaticFields(
      staticFields as ICsvStaticFields
    );

    if (schemaErrors.length > 0) {
      const status = Status.SCHEMA_ERRORS;
      const processToCreate: IProcessCreate = {
        id: processingId,
        fileName,
        bucketName,
        processingType: processingType,
        fileExtension: extension,
        competenceDate: parseDateString(competenceDate),
        processedBy: processedBy || undefined,
        companyId: safeParseNumber(companyId) || undefined,
        insurerId: safeParseNumber(insurerId) || undefined,
        failedRows: schemaErrors.length,
        totalRows: rows.length,
        currentStatus: Status.SCHEMA_ERRORS,
      };

      await createProcessAsync(processToCreate, status);
      await addSchemaErrorsAsync(processingId, schemaErrors);

      console.warn({
        message: `Processing failed with ${schemaErrors.length} errors`,
      });

      return;
    }
    company = await getCompanyByIdAsync({
      companyId: parseNumber(companyId),
    });

    healthPlans = await getHealthPlansByInsurerIdAsync({
      insurerId: parseNumber(insurerId),
    });

    const processToCreate: IProcessCreate = {
      id: processingId,
      fileName,
      bucketName,
      processingType: processingType,
      fileExtension: extension,
      competenceDate: parseDateString(competenceDate),
      processedBy,
      companyId: company?.id || undefined,
      insurerId: healthPlans.length > 0 ? parseNumber(insurerId) : undefined,
      totalRows: rows.length,
      failedRows: 0,
      currentStatus: Status.PROCESSING.toString(),
    };

    await createProcessAsync(processToCreate, Status.PROCESSING);

    const { _withErrors, _withoutErrors } = new BeneficiariesSchemaValidate(
      rows
    );

    if (_withoutErrors.length === 0) {
      const currentStatus = Status.PROCESSED_WITH_ERRORS;

      await addProcessedRowsAsync(processingId, errorType, _withErrors);

      const processToUpdate: IProcessUpdate = {
        id: processingId,
        currentStatus: currentStatus.toString(),
        updatedAt: new Date(),
        updatedRows: 0,
        failedRows: _withErrors.length,
      };

      await updateProcessInfoAsync(
        processingId,
        processToUpdate,
        currentStatus
      );

      console.warn({
        message: `Processing completed with ${_withErrors.length} errors`,
      });

      return;
    }

    console.info({
      message: `Comparing rows to find beneficiaries to create, update or ignore.`,
    });

    const [
      beneficiariesToCreate,
      beneficiariesToUpdate,
      recoveredBeneficiaries,
    ] = await processBeneficiaries(company.id, _withoutErrors);

    await createBeneficiaries(
      tracingId,
      company.id,
      healthPlans,
      beneficiariesToCreate
    );

    const { errors, success } = await updatedBeneficiary(
      tracingId,
      healthPlans,
      beneficiariesToUpdate,
      recoveredBeneficiaries
    );

    const errorsToSave = [...errors, ..._withErrors];

    const currentStatus =
      errorsToSave.length > 0
        ? Status.PROCESSED_WITH_ERRORS
        : Status.PROCESSED_WITH_SUCCESS;

    if (errorsToSave.length > 0) {
      await addProcessedRowsAsync(processingId, errorType, errorsToSave);
    }

    const processToUpdate: IProcessUpdate = {
      id: processingId,
      currentStatus: currentStatus.toString(),
      updatedAt: new Date(),
      updatedRows: success.length,
      failedRows: errorsToSave.length,
    };

    await updateProcessInfoAsync(processingId, processToUpdate, currentStatus);

    // TODO - Make resume and return

    console.info({
      finish: `Processing completed successfully`,
    });
  } catch (error) {
    console.error(`Error while receiving the file:`, error);
  }
};
