import { BeneficiaryErrorMessages } from "./beneficiary-errors";
import {
  IBeneficiary,
  IRowWithError,
  IRowWithoutError,
  ProcessedRow,
} from "../types/types";

export class BeneficiariesSchemaValidate {
  public readonly _withErrors: IRowWithError[] = [];
  public readonly _withoutErrors: IRowWithoutError[] = [];

  private readonly PRINCIPAL_BENEFICIARY: string = "TITULAR";
  private readonly DEPENDENT_BENEFICIARY: string = "DEPENDENTE";

  constructor(rows: ProcessedRow<IBeneficiary>[]) {
    for (let currentRow = 0; currentRow < rows.length; currentRow++) {
      const { raw, number, parsedRow: beneficiary } = rows[currentRow];

      const errors: string[] = this.validate(beneficiary);

      if (errors.length > 0) {
        this._withErrors.push({
          raw,
          number,
          errors,
        });
      } else {
        this._withoutErrors.push({
          raw,
          number,
          processedRow: beneficiary,
        });
      }
    }
  }

  private validate(beneficiary: IBeneficiary): string[] {
    const errors: string[] = [];

    if (!beneficiary.beneficiaryType) {
      errors.push(BeneficiaryErrorMessages.BENEFICIARY_TYPE_MISSING);
    } else if (
      beneficiary.beneficiaryType.toUpperCase() !==
        this.PRINCIPAL_BENEFICIARY.toUpperCase() &&
      beneficiary.beneficiaryType.toUpperCase() !==
        this.DEPENDENT_BENEFICIARY.toUpperCase()
    ) {
      errors.push(BeneficiaryErrorMessages.INVALID_BENEFICIARY_TYPE);
    }

    if (!this.validateCpf(beneficiary.cpf)) {
      errors.push(BeneficiaryErrorMessages.CPF_MISSING_OR_INVALID);
    }

    if (
      !this.validateCpf(beneficiary.cpfHolder) &&
      beneficiary.beneficiaryType.toUpperCase() ===
        this.DEPENDENT_BENEFICIARY.toUpperCase()
    ) {
      errors.push(BeneficiaryErrorMessages.HOLDER_CPF_MISSING_OR_INVALID);
    }

    if (!beneficiary.fullName) {
      errors.push(BeneficiaryErrorMessages.FULL_NAME_MISSING);
    }

    if (
      !beneficiary.dateOfBirth ||
      !this.validateDateOfBirth(beneficiary.dateOfBirth)
    ) {
      errors.push(BeneficiaryErrorMessages.DATE_OF_BIRTH_MISSING_OR_INVALID);
    }

    if (beneficiary.email && !this.validateEmail(beneficiary.email)) {
      errors.push(BeneficiaryErrorMessages.INVALID_EMAIL);
    }

    return errors;
  }

  private validateDateOfBirth(dateOfBirth: string): boolean {
    const dateOfBirthRegex =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dateOfBirthRegex.test(dateOfBirth);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validateCpf(cpf: string): boolean {
    return cpf?.length === 11;
  }
}
