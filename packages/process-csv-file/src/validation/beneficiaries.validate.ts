import { BeneficiaryErrorMessages } from "./beneficiary-errors";
import { ICsvStaticFields, IRowWithError } from "../types/types";

export class BeneficiaryValidateStaticFields {
  public readonly schemaErrors: IRowWithError[] = [];

  constructor(fixedValues: ICsvStaticFields) {
    const errors: string[] = this.validate(fixedValues);

    if (errors.length > 0) {
      this.schemaErrors.push({
        raw: "",
        number: 1,
        errors,
      });
      return;
    }
  }

  private validate(fixedValues: ICsvStaticFields): string[] {
    const errors: string[] = [];

    if (!fixedValues.processingType) {
      errors.push(BeneficiaryErrorMessages.PROCESS_TYPE_MISSING_OR_INVALID);
    }

    if (!fixedValues.companyId) {
      errors.push(BeneficiaryErrorMessages.COMPANY_MISSING_OR_INVALID);
    }

    if (
      !fixedValues.competenceDate ||
      !this.validateDate(fixedValues.competenceDate)
    ) {
      errors.push(BeneficiaryErrorMessages.COMPETENCE_DATE_MISSING_OR_INVALID);
    }

    if (
      !fixedValues.processedBy ||
      !this.validateEmail(fixedValues.processedBy)
    ) {
      errors.push(BeneficiaryErrorMessages.PROCESS_BY_INVALID_EMAIL);
    }

    return errors;
  }

  private validateDate(value: string): boolean {
    const dateOfBirthRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateOfBirthRegex.test(value);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
