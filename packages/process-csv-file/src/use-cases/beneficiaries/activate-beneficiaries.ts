import { publishEventBridgeEvent } from "@beneficiaries-domain/common/event-bridge-client";
import { getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms } from "../../repository/beneficiaries/beneficiaries";
import { IBeneficiaryToCreate } from "../../repository/beneficiaries/beneficiaries.types";
import {
  IMinorDependentBeneficiaryToActivate,
  IRowWithoutError,
} from "../../types/types";
import { calculateAge } from "../../utils/date-helpers";
import { BeneficiaryType } from "../../enums/beneficiary-type.enum";

export const activateBeneficiaries = async (
  tracingId: string,
  companyId: number,
  beneficiariesToActivate: {
    parsed: IRowWithoutError;
    created: IBeneficiaryToCreate;
  }[]
): Promise<void> => {
  const minorDependentBeneficiaries = beneficiariesToActivate.filter(
    (beneficiary) =>
      calculateAge(beneficiary.parsed.processedRow.dateOfBirth) < 18 &&
      beneficiary.parsed.processedRow.beneficiaryType.equalsIgnoreCase(
        BeneficiaryType.DEPENDENT
      )
  );

  const minorDependentHolderCpfs = minorDependentBeneficiaries.map(
    (beneficiary) => beneficiary.parsed.processedRow.cpfHolder
  );

  const { items: primaryBeneficiariesWithAcceptedTerms } =
    await getBeneficiariesByCompanyAndHolderCpfsAndAcceptedTerms({
      companyId,
      cpfs: minorDependentHolderCpfs,
    });

  const beneficiariesToActivateList: IMinorDependentBeneficiaryToActivate[] =
    [];

  for (const beneficiary of minorDependentBeneficiaries) {
    const parsedBeneficiary = beneficiary.parsed;
    const createdBeneficiary = beneficiary.created;
    const matchingHolder = primaryBeneficiariesWithAcceptedTerms.find(
      (primaryBeneficiary) =>
        primaryBeneficiary.cpf === parsedBeneficiary.processedRow.cpfHolder
    );

    if (matchingHolder) {
      beneficiariesToActivateList.push({
        parsed: parsedBeneficiary,
        created: createdBeneficiary,
        holder: matchingHolder,
      });
    }
  }

  const beneficiaryEvents: object[] = beneficiariesToActivateList.map(
    (beneficiary) => ({
      id: beneficiary.created.id,
      displayName: beneficiary.parsed.processedRow.fullName,
      acceptedTermsAt: beneficiary.holder?.accepted_terms_at,
      phoneNumber: beneficiary.holder?.phone_number,
    })
  );

  if (beneficiaryEvents.length > 0) {
    console.info({
      message: `${beneficiaryEvents.length} minor dependent beneficiaries to activate`,
    });
  } else {
    console.info({
      message: "No minor dependent beneficiaries to activate",
    });
  }

  for await (const event of beneficiaryEvents) {
    await publishEventBridgeEvent(
      "beneficiary.activate",
      process.env.EVENT_BUS_NAME ?? "default",
      process.env.AWS_REGION ?? "us-east-2",
      tracingId,
      event
    );
  }
};
