import { BeneficiaryErrorMessages } from "../../src/validation/beneficiary-errors";

describe("BeneficiaryErrorMessages", () => {
  it("should have a static readonly BENEFICIARY_TYPE_MISSING property", () => {
    expect(BeneficiaryErrorMessages.BENEFICIARY_TYPE_MISSING).toBe(
      "Tipo de beneficiário não informado"
    );
  });

  it("should have a static readonly INVALID_BENEFICIARY_TYPE property", () => {
    expect(BeneficiaryErrorMessages.INVALID_BENEFICIARY_TYPE).toBe(
      "Tipo de beneficiário inválido. Use apenas TITULAR ou DEPENDENTE"
    );
  });

  it("should have a static readonly HOLDER_CPF_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.HOLDER_CPF_MISSING_OR_INVALID).toBe(
      "Número do cpf do titular não informado ou inválido"
    );
  });

  it("should have a static readonly CPF_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.CPF_MISSING_OR_INVALID).toBe(
      "CPF não informado ou inválido: use apenas números"
    );
  });

  it("should have a static readonly FULL_NAME_MISSING property", () => {
    expect(BeneficiaryErrorMessages.FULL_NAME_MISSING).toBe(
      "Nome completo não informado"
    );
  });

  it("should have a static readonly DATE_OF_BIRTH_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.DATE_OF_BIRTH_MISSING_OR_INVALID).toBe(
      "Data de nascimento não informada ou inválida: use o formato DD/MM/AAAA"
    );
  });

  it("should have a static readonly INVALID_EMAIL property", () => {
    expect(BeneficiaryErrorMessages.INVALID_EMAIL).toBe("E-mail inválido");
  });

  it("should have a static readonly PROCESS_TYPE_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.PROCESS_TYPE_MISSING_OR_INVALID).toBe(
      "Tipo de processamento não informado ou inválido. Use apenas Base de beneficiários, Adição individual ou Correção"
    );
  });

  it("should have a static readonly COMPANY_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.COMPANY_MISSING_OR_INVALID).toBe(
      "O ID da empresa não foi informado ou é inválido"
    );
  });

  it("should have a static readonly COMPETENCE_DATE_MISSING_OR_INVALID property", () => {
    expect(BeneficiaryErrorMessages.COMPETENCE_DATE_MISSING_OR_INVALID).toBe(
      "A data de competência não informada ou inválida: use o formato DD/MM/AAAA"
    );
  });

  it("should have a static readonly PROCESS_BY_INVALID_EMAIL property", () => {
    expect(BeneficiaryErrorMessages.PROCESS_BY_INVALID_EMAIL).toBe(
      "E-mail não informado ou inválido"
    );
  });
});
