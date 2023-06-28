import { processBeneficiaries } from "../../../src/use-cases/beneficiaries/get-beneficiaries";
import { getBeneficiariesByCompanyAndCpfs } from "../../../src/repository/beneficiaries/beneficiaries";
import { IBeneficiary, IListBeneficiaries } from "../../../src/repository/beneficiaries/beneficiaries.types";
import { IBeneficiary as IBeneficiaryWithoutErrors, IRowWithoutError } from "../../../src/types/types";

jest.mock("../../../src/repository/beneficiaries/beneficiaries");

describe("processBeneficiaries", () => {
  const getBeneficiariesByCompanyAndCpfsMock =
    getBeneficiariesByCompanyAndCpfs as jest.MockedFunction<
      typeof getBeneficiariesByCompanyAndCpfs
    >;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should process beneficiaries successfully", async () => {
    const beneficiariesWithoutErrors: IBeneficiaryWithoutErrors[] = [
      {
        beneficiaryType: "Type 1",
        planCode: "ABC123",
        planName: "Plan 1",
        cardNumber: "123456789",
        holderCardNumber: "987654321",
        cpf: "123456789",
        fullName: "John Doe",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        email: "johndoe@example.com",
        cpfHolder: "987654321",
      },
      {
        beneficiaryType: "Type 2",
        planCode: "XYZ456",
        planName: "Plan 2",
        cardNumber: "987654321",
        holderCardNumber: "123456789",
        cpf: "987654321",
        fullName: "Jane Smith",
        dateOfBirth: "1995-05-05",
        gender: "Female",
        email: "janesmith@example.com",
        cpfHolder: "123456789",
      },
      {
        beneficiaryType: "Type 3",
        planCode: "DEF789",
        planName: "Plan 3",
        cardNumber: "654321987",
        holderCardNumber: "321987654",
        cpf: "654321987",
        fullName: "Bob Johnson",
        dateOfBirth: "1980-12-15",
        gender: "Male",
        email: "bobjohnson@example.com",
        cpfHolder: "654987321",
      },
    ];

    const beneficiaries = [
      {
        id: "1",
        companyId: 123,
        healthPlanCardId: "CARD1",
        holderHealthPlanCardId: "HOLDER_CARD1",
        beneficiaryTypeId: 1,
        name: "John Doe",
        cpf: "123456789",
        birthDate: "1990-01-01",
        healthPlanId: 456,
        statusId: 1,
        gender: "Male",
        createdAt: new Date('2023-06-23'),
        updatedAt: new Date('2023-06-23'),
        deletedAt: undefined,
        acceptedTermsAt: undefined,
        phoneNumber: "1234567890",
        displayName: "Beneficiary 1",
      },
      {
        id: "2",
        companyId: 456,
        healthPlanCardId: "CARD2",
        holderHealthPlanCardId: "HOLDER_CARD2",
        beneficiaryTypeId: 2,
        name: "Jane Smith",
        cpf: "987654321",
        birthDate: "1995-05-05",
        healthPlanId: 789,
        statusId: 2,
        gender: "Female",
        createdAt: new Date('2023-06-23'),
        updatedAt: new Date(),
        deletedAt: undefined,
        acceptedTermsAt: undefined,
        phoneNumber: "9876543210",
        displayName: "Beneficiary 2",
      },
    ];

    const mockBeneficiaries: IListBeneficiaries = {
      items: [...beneficiaries],
    };

    const listBeneficiariesMock =
      (): Promise<IListBeneficiaries> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockBeneficiaries);
          }, 2000); // Simulando um atraso de 2 segundos na resposta
        });
      };

    getBeneficiariesByCompanyAndCpfsMock.mockResolvedValue(listBeneficiariesMock());

    const withoutErrors: IRowWithoutError[] = beneficiariesWithoutErrors.map((beneficiary, index) => ({
      processedRow: beneficiary,
      number: index + 1,
      raw: 'raw mock'
    }))

    const beneficiariesToCreate = [withoutErrors[2]];
    const beneficiariesToUpdate = [withoutErrors[0], withoutErrors[1]];
    const result = await processBeneficiaries(123, withoutErrors);
    const expected: [IRowWithoutError[], IRowWithoutError[], IBeneficiary[]] = [beneficiariesToCreate, beneficiariesToUpdate, mockBeneficiaries.items];
    expect(result).toEqual(expected);
  });
});
