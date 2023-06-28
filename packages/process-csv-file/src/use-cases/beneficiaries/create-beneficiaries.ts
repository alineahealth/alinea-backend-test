import { randomUUID } from "crypto";
import { IBeneficiaryToCreate } from "../../repository/beneficiaries/beneficiaries.types";
import { IRowWithoutError } from "../../types/types";
import { createBeneficiariesAsync } from "../../repository/beneficiaries/beneficiaries";
import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import { activateBeneficiaries } from "./../beneficiaries/activate-beneficiaries";
import { BeneficiaryType } from "../../enums/beneficiary-type.enum";
import { IHealthPlan } from "../../repository/health-plan/health-plan.types";
import { getHeathPlanInfoByCodeOrName } from "../../utils/health-plan-helpers";
import { forceParseDateString } from "../../utils/date-helpers";

// TODO - Refactor this function to return same as updateBeneficiaries
// TODO - Refactor this function if dateOfBirth is wrong add error to row
export const createBeneficiaries = async (
  tracingId: string,
  companyId: number,
  healthPlans: IHealthPlan[],
  beneficiariesToCreate: IRowWithoutError[]
): Promise<void> => {
  const beneficiaries: IBeneficiaryToCreate[] = [];
  const beneficiariesEvents: object[] = [];
  const beneficiariesToActivate: {
    parsed: IRowWithoutError;
    created: IBeneficiaryToCreate;
  }[] = [];

  if (beneficiariesToCreate.length == 0) return;

  for (const beneficiary of beneficiariesToCreate) {
    const beneficiaryId = randomUUID();

    const healthPlan = getHeathPlanInfoByCodeOrName(
      healthPlans,
      beneficiary.processedRow.planCode,
      beneficiary.processedRow.planName
    );

    beneficiariesEvents.push({
      id: beneficiaryId,
      cpf: beneficiary.processedRow.cpf,
      fullName: beneficiary.processedRow.fullName,
      birthDate: forceParseDateString(beneficiary.processedRow.dateOfBirth),
      beneficiaryType:
        BeneficiaryType.HOLDER.valueOf() ==
        beneficiary.processedRow.beneficiaryType.toUpperCase()
          ? 1
          : 2,
      company: companyId,
      holderCpf: beneficiary.processedRow.cpfHolder,
    });

    const beneficiaryObject: IBeneficiaryToCreate = {
      id: beneficiaryId,
      companyId: companyId,
      healthPlanCardId: beneficiary.processedRow.cardNumber,
      holderHealthPlanCardId: beneficiary.processedRow.holderCardNumber,
      beneficiaryTypeId:
        BeneficiaryType.HOLDER.valueOf() ==
        beneficiary.processedRow.beneficiaryType.toUpperCase()
          ? 1
          : 2,
      name: beneficiary.processedRow.fullName,
      cpf: beneficiary.processedRow.cpf,
      birthDate: forceParseDateString(beneficiary.processedRow.dateOfBirth),
      healthPlanId: healthPlan?.id,
      statusId: 1,
      gender: beneficiary.processedRow.gender,
      holderCpf: beneficiary.processedRow.cpfHolder,
      createdAt: new Date(),
    };

    beneficiaries.push(beneficiaryObject);

    beneficiariesToActivate.push({
      parsed: beneficiary,
      created: beneficiaryObject,
    });
  }

  await createBeneficiariesAsync({
    beneficiaries: beneficiaries,
  });

  for await (const event of beneficiariesEvents) {
    await publishEventBridgeEvent(
      "beneficiary.create",
      process.env.EVENT_BUS_NAME ?? "default",
      process.env.AWS_REGION ?? "us-east-2",
      tracingId,
      event
    );
  }

  await activateBeneficiaries(tracingId, companyId, beneficiariesToActivate);
};
