import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import {
  createBeneficiariesHistoriesAsync,
  updateBeneficiariesAsync,
} from "../../repository/beneficiaries/beneficiaries";
import {
  IBeneficiaryToUpdate,
  IBeneficiary,
} from "../../repository/beneficiaries/beneficiaries.types";
import { IHealthPlan } from "../../repository/health-plan/health-plan.types";
import {
  IRowWithError,
  IRowWithoutError,
  QueryResult,
} from "../../types/types";
import { IBeneficiaryHistory } from "./../../repository/beneficiaries/beneficiaries.types";
import {
  getHeathPlanInfoByCodeOrName,
  getHeathPlanInfoById,
} from "../../utils/health-plan-helpers";

export const updatedBeneficiary = async (
  tracingId: string,
  healthPlans: IHealthPlan[],
  beneficiariesToUpdate: IRowWithoutError[],
  recoveredBeneficiaries: IBeneficiary[]
): Promise<QueryResult> => {
  if (beneficiariesToUpdate.length == 0) {
    return {
      success: [],
      errors: [],
    };
  }

  const date = new Date();

  const beneficiaries = mappingBeneficiariesToUpdate(
    healthPlans,
    beneficiariesToUpdate,
    recoveredBeneficiaries,
    date
  );

  const updatedBeneficiaries = await updateBeneficiariesAsync({
    beneficiaries,
  });

  const beneficiariesHistories = mappingHistoryToCreate(
    updatedBeneficiaries,
    date
  );

  await createBeneficiariesHistoriesAsync({
    beneficiaries: beneficiariesHistories,
  });

  const beneficiariesToUpdateEvents = mappingEventsToCreate(
    updatedBeneficiaries,
    healthPlans
  );

  for await (const event of beneficiariesToUpdateEvents) {
    await publishEventBridgeEvent(
      "beneficiary.updated",
      process.env.EVENT_BUS_NAME ?? "default",
      process.env.AWS_REGION ?? "us-east-2",
      tracingId,
      event
    );
  }

  return resumeUpdate(updatedBeneficiaries, beneficiariesToUpdate);
};

// TODO - Remove beneficiaries if they only have empty values to update
const mappingBeneficiariesToUpdate = (
  healthPlans: IHealthPlan[],
  beneficiariesToUpdate: IRowWithoutError[],
  recoveredBeneficiaries: IBeneficiary[],
  date: Date
): IBeneficiaryToUpdate[] => {
  const createBeneficiariesToUpdate: IBeneficiaryToUpdate[] = [];

  for (const beneficiary of beneficiariesToUpdate) {
    const recoveredBeneficiary = recoveredBeneficiaries.find(
      (b) => b.cpf === beneficiary.processedRow.cpf
    );

    if (!recoveredBeneficiary) {
      continue;
    }

    const beneficiaryRow = beneficiary.processedRow;

    const healthPlan = getHeathPlanInfoByCodeOrName(
      healthPlans,
      beneficiary.processedRow.planCode,
      beneficiary.processedRow.planName
    );

    const beneficiaryToUpdate: IBeneficiaryToUpdate = {
      id: recoveredBeneficiary.id,
      healthPlanId:
        healthPlan?.id !== undefined && healthPlan?.id !== 0
          ? healthPlan.id
          : recoveredBeneficiary.healthPlanId,
      healthPlanCardId:
        beneficiaryRow?.cardNumber && beneficiaryRow?.cardNumber !== ""
          ? beneficiaryRow?.cardNumber
          : recoveredBeneficiary.healthPlanCardId,
      holderHealthPlanCardId:
        beneficiaryRow?.holderCardNumber &&
        beneficiaryRow?.holderCardNumber !== ""
          ? beneficiaryRow?.holderCardNumber
          : recoveredBeneficiary.holderHealthPlanCardId,
      updatedAt: date,
    };

    createBeneficiariesToUpdate.push(beneficiaryToUpdate);
  }

  return createBeneficiariesToUpdate;
};

const mappingHistoryToCreate = (
  updatedBeneficiaries: IBeneficiary[],
  date: Date
): IBeneficiaryHistory[] => {
  const createBeneficiariesHistories: IBeneficiaryHistory[] = [];

  for (const beneficiary of updatedBeneficiaries) {
    const beneficiaryHistory: IBeneficiaryHistory = {
      beneficiary_id: beneficiary.id,
      date: date,
      action: "updated-beneficiary",
      status_id: 1,
    };

    createBeneficiariesHistories.push(beneficiaryHistory);
  }

  return createBeneficiariesHistories;
};

const mappingEventsToCreate = (
  updatedBeneficiaries: IBeneficiary[],
  healthPlans: IHealthPlan[]
): object[] => {
  const createBeneficiariesEvents: object[] = [];

  for (const beneficiary of updatedBeneficiaries) {
    const healthPlan = getHeathPlanInfoById(
      healthPlans,
      beneficiary.healthPlanId
    );

    const beneficiaryEvent = {
      id: beneficiary.id,
      cpf: beneficiary.cpf,
      fullName: beneficiary.name,
      birthDate: beneficiary.birthDate,
      beneficiaryType: beneficiary.beneficiaryTypeId,
      company: beneficiary.companyId,
      plan: {
        insuranceId: healthPlan?.insurer_id,
        healthPlanId: beneficiary.healthPlanId,
      },
    };

    createBeneficiariesEvents.push(beneficiaryEvent);
  }

  return createBeneficiariesEvents;
};

const resumeUpdate = (
  updatedBeneficiaries: IBeneficiary[],
  beneficiariesToUpdate: IRowWithoutError[]
): QueryResult => {
  const successRows: IRowWithoutError[] = [];
  const failedRows: IRowWithError[] = [];

  const updatedBeneficiariesCpfs = updatedBeneficiaries.map(
    (beneficiary) => beneficiary.cpf
  );

  const beneficiariesNotUpdated = beneficiariesToUpdate.filter(
    (beneficiary) =>
      !updatedBeneficiariesCpfs.some(
        (cpf) => cpf === beneficiary.processedRow.cpf
      )
  );

  for (const beneficiary of beneficiariesNotUpdated) {
    const errors: string[] = [];
    errors.push("Erro ao atualizar beneficiário");
    failedRows.push({
      number: beneficiary.number,
      raw: beneficiary.raw,
      errors,
    });
  }

  for (const beneficiaryToUpdate of beneficiariesToUpdate) {
    const isBeneficiaryNotUpdated = beneficiariesNotUpdated.some(
      (beneficiary) =>
        beneficiary.processedRow.cpf === beneficiaryToUpdate.processedRow.cpf
    );

    if (!isBeneficiaryNotUpdated) {
      successRows.push(beneficiaryToUpdate);
    }
  }

  return {
    success: successRows,
    errors: failedRows,
  };
};
