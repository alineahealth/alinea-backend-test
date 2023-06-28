import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import {
  IBeneficiary,
  IBeneficiaryData,
  IRegisterCheckResult,
} from "./put-many-beneficiaries.type";
import {
  changeBeneficiaryHistory,
  createBeneficiaries,
  findCPFsInDatabase,
  listCompanies,
  listPlans,
  updateBeneficiaries,
} from "./put-many-beneficiaries.model";
import {
  dataDBValidation,
  attributesValidation,
  checkRegister,
} from "./helpers";
import { randomUUID } from "crypto";

export const putManyBeneficiaries = async (params: {
  body: IBeneficiaryData[];
  tracingID: string;
}): Promise<IRegisterCheckResult> => {
  try {
    const { body, tracingID } = params;
    if (!body) {
      throw new Error(
        `I can not register without information ${tracingID} does not have body`
      );
    }
    const requestedData = attributesValidation(body);
    const { goodRequest, failedRequest } = requestedData;

    if (failedRequest) {
      console.info({
        tracingID,
        message:
          "This people can not be register or update because do not have all necessary information",
        data: {
          failedRequest,
        },
      });
    }

  // ####### 
  // valid if has health_plans and companies to use
    const companies = await listCompanies();
    const plans = await listPlans();
    dataDBValidation(plans, companies);

  // ####### 

    const beneficiariesReadToCheckDB = await checkRegister(
      goodRequest,
      companies,
      plans
    );

    console.info({
      tracingID,
      message:
        "Normalized the information to check DB, with companyId and planId.",
      data: beneficiariesReadToCheckDB,
    });

// ############ 
// Select all beneficiaries to update
    const toUpdate: IBeneficiary[] = [];
    await Promise.all(
      beneficiariesReadToCheckDB.map(async (item) => {
        const result = await findCPFsInDatabase(item, tracingID);
        if (result !== undefined) {
          const infoToUpdate: IBeneficiary = {
            ...result,
            health_plan_card_id: item.healthPlanCardId,
            health_plan_id: item.healthPlanId,
            holder_health_plan_card_id: item.holderHealthPlanCardId
          };
          toUpdate.push(infoToUpdate);
        }
      })
    );
// ############ 
// Identify all beneficiaries to create
    const listToCreate = beneficiariesReadToCheckDB.filter((item) => {
      return !toUpdate.some((up) => up.cpf === item.cpf);
    });

    console.info({
      tracingID,
      message:
        "Current and new beneficiaries checked by their CPFs and company",
      data: {
        toUpdate: toUpdate,
        toCreate: listToCreate,
      },
    });

    const createdBeneficiaries: any[] = [];
    if (listToCreate.length > 0) {
      await Promise.all(
        listToCreate.map(async (item) => {
          const id = randomUUID();
          const result = await createBeneficiaries(item, id, tracingID);
          createdBeneficiaries.push(result)
          console.info({
            tracingID,
            message: "Create beneficiary",
            data: {
              cpf: item.cpf,
              id: id,
            },
          });
          publishEventBridgeEvent(
            "beneficiary.create",
            process.env.EVENT_BUS_NAME ?? "default",
            process.env.AWS_REGION ?? "us-east-2",
            tracingID,
            {
              id: id,
              cpf: item.cpf,
              fullName: item.name,
              birthDate: item.birthDate,
              beneficiaryType: item.beneficiaryTypeId,
              company: item.companyId,
              holderCpf:
              item.beneficiaryTypeId === 2
              ? beneficiariesReadToCheckDB.find(
                (person) => person.cpf === item.cpf
                )?.holderCPF
                : null,
              }
              );
              console.info({
                tracingID,
                message: "Beneficiary created and event published",
                data: {
              cpf: item.cpf,
              id,
            },
          });
          return;
        })
      );
    }
    const updatedBeneficiaries: any[] = [];
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(async (item) => {
          const result = await updateBeneficiaries(item, tracingID);
          updatedBeneficiaries.push(result)

          await changeBeneficiaryHistory(
            {
              beneficiary_id: item.id,
              action: "updated-beneficiary",
            },
            tracingID
          );

          publishEventBridgeEvent(
            "beneficiary.update",
            process.env.EVENT_BUS_NAME ?? "default",
            process.env.AWS_REGION ?? "us-east-2",
            tracingID,
            {
              id: item.id,
              cpf: item.cpf,
              fullName: item.name,
              birthDate: item.birth_date,
              beneficiaryType: item.beneficiary_type_id,
              company: item.company_id,
              plan: {
                insuranceId: plans.find((c) => c.id === item.health_plan_id)
                  ?.insurer_id,
                healthPlanId: item.health_plan_id,
              },
            }
          );
          console.info({
            tracingID,
            message: "Beneficiary updated, event published and history updated",
            data: {
              cpf: item.cpf,
              company: item.company_id,
              healthPlanId: item.health_plan_id,
              healthPlanCardId: item.health_plan_card_id,
              holderHealthPlanId: item.holder_health_plan_card_id,
            },
          });
          return;
        })
      );
    }

    const errorsDB = body.length - (updatedBeneficiaries.length + createdBeneficiaries.length + failedRequest.length);
    return {
      totalSuccess: updatedBeneficiaries.length + createdBeneficiaries.length,
      updateSuccess: updatedBeneficiaries.length,
      createSuccess: createdBeneficiaries.length,
      totalErrors: failedRequest.length,
      requestErrors: failedRequest,
      dbErrors: errorsDB > 0 ? errorsDB : 0
    };
  } catch (err) {
    console.error(
      `${params.tracingID}: ${
        (err as Error).message
      } ERR_PUT_MANY_BENEFICIARIES ${JSON.stringify((err as Error).stack)}`
    );
    throw new Error((err as Error).message);
  }
};
