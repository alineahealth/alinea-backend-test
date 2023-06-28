import { BeneficiaryValidateStaticFields } from "../../src/validation/beneficiaries.validate";

describe("BeneficiaryValidateStaticFields", () => {
  describe("constructor", () => {
    it("should add an error to schemaErrors if validation fails", () => {
      const fixedValues = {
        processingType: "",
        companyId: "",
        insurerId: "",
        competenceDate: "",
        processedBy: "",
      };

      const validator = new BeneficiaryValidateStaticFields(fixedValues);

      expect(validator.schemaErrors.length).toBe(1);
      expect(validator.schemaErrors[0].errors).toEqual([
        "Tipo de processamento não informado ou inválido. Use apenas Base de beneficiários, Adição individual ou Correção",
        "O ID da empresa não foi informado ou é inválido",
        "A data de competência não informada ou inválida: use o formato DD/MM/AAAA",
        "E-mail não informado ou inválido",
      ]);
    });

    it("should not add an error to schemaErrors if validation passes", () => {
      const fixedValues = {
        processingType: "Type",
        companyId: "Company",
        competenceDate: "01/01/2023",
        insurerId: "123",
        processedBy: "email@example.com",
      };

      const validator = new BeneficiaryValidateStaticFields(fixedValues);

      expect(validator.schemaErrors.length).toBe(0);
    });
  });

  describe("validate", () => {
    it("should return an array of errors for invalid fixed values", () => {
      const fixedValues = {
        processingType: "",
        companyId: "",
        insurerId: "",

        competenceDate: "",
        processedBy: "",
      };

      const validator = new BeneficiaryValidateStaticFields(fixedValues);
      const errors = validator["validate"](fixedValues);

      expect(errors.length).toBe(4);
      expect(errors).toEqual([
        "Tipo de processamento não informado ou inválido. Use apenas Base de beneficiários, Adição individual ou Correção",
        "O ID da empresa não foi informado ou é inválido",
        "A data de competência não informada ou inválida: use o formato DD/MM/AAAA",
        "E-mail não informado ou inválido",
      ]);
    });

    it("should return an empty array for valid fixed values", () => {
      const fixedValues = {
        processingType: "Type",
        companyId: "Company",
        insurerId: "123",
        competenceDate: "01/01/2023",
        processedBy: "email@example.com",
      };

      const validator = new BeneficiaryValidateStaticFields(fixedValues);
      const errors = validator["validate"](fixedValues);

      expect(errors.length).toBe(0);
    });
  });

  describe("validateDate", () => {
    it("should return true for a valid date", () => {
      const validator = new BeneficiaryValidateStaticFields({
        processingType: "Type",
        companyId: "Company",
        competenceDate: "01/01/2023",
        insurerId: "123",
        processedBy: "email@example.com",
      });
      const isValid = validator["validateDate"]("01/01/2023");

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid date", () => {
      const validator = new BeneficiaryValidateStaticFields({
        processingType: "Type",
        companyId: "Company",
        competenceDate: "2023/01/01",
        insurerId: "123",
        processedBy: "email@example.com",
      });
      const isValid = validator["validateDate"]("2023/01/01");

      expect(isValid).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("should return true for a valid email", () => {
      const validator = new BeneficiaryValidateStaticFields({
        processingType: "Type",
        companyId: "Company",
        competenceDate: "01/01/2023",
        insurerId: "123",
        processedBy: "email@example.com",
      });
      const isValid = validator["validateEmail"]("email@example.com");

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid email", () => {
      const validator = new BeneficiaryValidateStaticFields({
        processingType: "Type",
        companyId: "Company",
        competenceDate: "01/01/2023",
        insurerId: "123",
        processedBy: "email@example",
      });
      const isValid = validator["validateEmail"]("email@example");

      expect(isValid).toBe(false);
    });
  });
});
