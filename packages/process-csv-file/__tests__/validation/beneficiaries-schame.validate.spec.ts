import { IBeneficiary } from "../../src/types/types";
import { BeneficiariesSchemaValidate } from "../../src/validation/beneficiaries-schame.validate";

describe("BeneficiariesSchemaValidate", () => {
  describe("constructor", () => {
    it("should add rows with errors to _withErrors array", () => {
      const rows = [
        {
          raw: "row 1",
          number: 1,
          parsedRow: {
            beneficiaryType: "",
            cpf: "",
            cpfHolder: "",
            fullName: "",
            dateOfBirth: "",
            email: "",
            planCode: "",
            planName: "",
            cardNumber: "",
            holderCardNumber: "",
            gender: "",
          },
        },
        {
          raw: "row 2",
          number: 2,
          parsedRow: {
            beneficiaryType: "INVALID",
            cpf: "",
            cpfHolder: "",
            fullName: "John Doe",
            dateOfBirth: "01/01/2000",
            email: "invalid.email",
            planCode: "",
            planName: "",
            cardNumber: "",
            holderCardNumber: "",
            gender: "",
          },
        },
      ];
      const validator = new BeneficiariesSchemaValidate(rows);

      expect(validator._withErrors.length).toBe(2);
      expect(validator._withErrors[0]).toEqual({
        raw: "row 1",
        number: 1,
        errors: [
          "Tipo de beneficiário não informado",
          "CPF não informado ou inválido: use apenas números",
          "Nome completo não informado",
          "Data de nascimento não informada ou inválida: use o formato DD/MM/AAAA",
        ],
      });
      expect(validator._withErrors[1]).toEqual({
        raw: "row 2",
        number: 2,
        errors: [
          "Tipo de beneficiário inválido. Use apenas TITULAR ou DEPENDENTE",
          "CPF não informado ou inválido: use apenas números",
          "E-mail inválido",
        ],
      });
    });

    it("should add rows without errors to _withoutErrors array", () => {
      const rows = [
        {
          raw: "row 1",
          number: 1,
          parsedRow: {
            beneficiaryType: "TITULAR",
            cpf: "12345678901",
            cpfHolder: "",
            fullName: "John Doe",
            dateOfBirth: "01/01/2000",
            email: "john.doe@example.com",
            planCode: "123",
            planName: "ABC",
            cardNumber: "321456",
            holderCardNumber: "123432",
            gender: "Masculino",
          },
        },
      ];
      const validator = new BeneficiariesSchemaValidate(rows);

      expect(validator._withoutErrors.length).toBe(1);
      expect(validator._withoutErrors[0]).toEqual({
        raw: "row 1",
        number: 1,
        processedRow: {
          beneficiaryType: "TITULAR",
          cpf: "12345678901",
          cpfHolder: "",
          fullName: "John Doe",
          dateOfBirth: "01/01/2000",
          email: "john.doe@example.com",
          planCode: "123",
          planName: "ABC",
          cardNumber: "321456",
          holderCardNumber: "123432",
          gender: "Masculino",
        },
      });
    });
  });

  describe("validate", () => {
    it("should return an array of errors for invalid beneficiary", () => {
      const beneficiary: IBeneficiary = {
        beneficiaryType: "",
        cpf: "",
        cpfHolder: "",
        fullName: "",
        dateOfBirth: "",
        email: "",
        planCode: "",
        planName: "",
        cardNumber: "",
        holderCardNumber: "",
        gender: "",
      };

      const validator = new BeneficiariesSchemaValidate([]);
      const errors = validator["validate"](beneficiary);

      expect(errors.length).toBe(4);
      expect(errors).toEqual([
        "Tipo de beneficiário não informado",
        "CPF não informado ou inválido: use apenas números",
        "Nome completo não informado",
        "Data de nascimento não informada ou inválida: use o formato DD/MM/AAAA",
      ]);
    });

    it("should return an empty array for valid beneficiary", () => {
      const beneficiary: IBeneficiary = {
        beneficiaryType: "TITULAR",
        cpf: "12345678901",
        cpfHolder: "12345678902",
        fullName: "John Doe",
        dateOfBirth: "01/01/2000",
        email: "john.doe@example.com",
        planCode: "321",
        planName: "Test Plan",
        cardNumber: "19281321",
        holderCardNumber: "4321231",
        gender: "",
      };

      const validator = new BeneficiariesSchemaValidate([]);
      const errors = validator["validate"](beneficiary);

      expect(errors.length).toBe(0);
    });
  });

  describe("validateDateOfBirth", () => {
    it("should return true for a valid date of birth", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateDateOfBirth"]("01/01/2000");

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid date of birth", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateDateOfBirth"]("2023/01/01");

      expect(isValid).toBe(false);
    });
  });

  describe("validateEmail", () => {
    it("should return true for a valid email", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateEmail"]("email@example.com");

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid email", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateEmail"]("email@example");

      expect(isValid).toBe(false);
    });
  });

  describe("validateCpf", () => {
    it("should return true for a valid CPF", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateCpf"]("12345678901");

      expect(isValid).toBe(true);
    });

    it("should return false for an invalid CPF", () => {
      const validator = new BeneficiariesSchemaValidate([]);
      const isValid = validator["validateCpf"]("123");

      expect(isValid).toBe(false);
    });
  });
});
