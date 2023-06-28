import { convertObjToBeneficiary } from "../../src/utils/beneficiary-helpers";
import {
  IBeneficiary,
  IBeneficiaryDatabase,
} from "../../src/repository/beneficiaries/beneficiaries.types";

describe("convertObjToBeneficiary", () => {
  it("should convert object to beneficiary correctly", () => {
    const line: IBeneficiaryDatabase = {
      id: "1",
      company_id: 123,
      health_plan_card_id: "456",
      holder_health_plan_card_id: "789",
      beneficiary_type_id: 1,
      name: "John Doe",
      cpf: "123456789",
      birth_date: "1990-01-01",
      health_plan_id: 987,
      status_id: 1,
      gender: "male",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: undefined,
      accepted_terms_at: undefined,
      phone_number: "987654321",
      display_name: "John D.",
    };

    const expected: IBeneficiary = {
      id: "1",
      companyId: 123,
      healthPlanCardId: "456",
      holderHealthPlanCardId: "789",
      beneficiaryTypeId: 1,
      name: "John Doe",
      cpf: "123456789",
      birthDate: "1990-01-01",
      healthPlanId: 987,
      statusId: 1,
      gender: "male",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      acceptedTermsAt: undefined,
      phoneNumber: "987654321",
      displayName: "John D.",
    };

    const result = convertObjToBeneficiary(line);
    expect(result).toEqual(expected);
  });
});
