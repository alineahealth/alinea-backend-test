import { createBeneficiaries } from "../../../src/repository/beneficiaries/beneficiaries.create";
import { pool } from "../../../src/repository/database";
import { generateInsertValues } from "../../../src/utils/database-helpers";
import { beneficiariesToCreateMock } from "../../../__mock__/beneficiariesMock";

jest.mock("../../../src/repository/database");
jest.mock("../../../src/utils/database-helpers");

describe("createBeneficiaries", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockGenerateInsertValues = generateInsertValues as jest.MockedFunction<
    typeof generateInsertValues
  >;
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({
        query: mockQuery,
        release: mockRelease,
      }),
      end: jest.fn(),
    } as any);
  });

  const mockInsertValues: {
    text: string;
    values: (number | string | Date | null)[];
  } = {
    text: `INSERT INTO beneficiaries ("id", "company_id", "cpf", "health_plan_card_id", "holder_health_plan_card_id", "beneficiary_type_id", "name", "birth_date", "health_plan_id", "status_id", "gender", "holder_cpf", "updated_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13), ($14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26), ($27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)`,
    values: [
      "db41c270-3b9b-4d3d-9af4-7316dbde54ad",
      123,
      "123.456.789-00",
      "abc123",
      "def456",
      1,
      "João",
      new Date("1990-01-01"),
      456,
      1,
      "M",
      "987.654.321-00",
      new Date("2023-06-22T14:15:38.359Z"),
      "e8a5c9de-7e42-44a0-9dd0-549d9d03361f",
      789,
      "987.654.321-00",
      "xyz789",
      "uvw987",
      2,
      "Maria",
      new Date("1985-05-05"),
      123,
      2,
      "F",
      "123.456.789-00",
      new Date("2023-06-22T14:15:38.359Z"),
      "f4c2ed24-9e2f-4ff0-bd20-6a0e974b0bc4",
      456,
      "555.444.333-22",
      "pqr456",
      "jkl321",
      1,
      "Pedro",
      new Date("1995-10-10"),
      null,
      1,
      "M",
      "555.444.333-22",
      new Date("2023-06-22T14:15:38.359Z"),
    ],
  };
  const columns = [
    "id",
    "company_id",
    "cpf",
    "health_plan_card_id",
    "holder_health_plan_card_id",
    "beneficiary_type_id",
    "name",
    "birth_date",
    "health_plan_id",
    "status_id",
    "gender",
    "holder_cpf",
    "updated_at",
  ];

  const date = new Date();

  const valuesMock: any[][] = beneficiariesToCreateMock.map((beneficiary) => [
    beneficiary.id,
    beneficiary.companyId,
    beneficiary.cpf,
    beneficiary.healthPlanCardId,
    beneficiary.holderHealthPlanCardId,
    beneficiary.beneficiaryTypeId,
    beneficiary.name,
    beneficiary.birthDate,
    beneficiary.healthPlanId,
    beneficiary.statusId,
    beneficiary.gender,
    beneficiary.holderCpf,
    date,
  ]);

  it("should insert beneficiaries successfully", async () => {
    mockGenerateInsertValues.mockReturnValueOnce(mockInsertValues);
    mockQuery.mockImplementation(() => ({ rowCount: 3 }));
    const result = await createBeneficiaries(
      { beneficiaries: beneficiariesToCreateMock },
      date
    );

    expect(result).toBe(true);
    expect(generateInsertValues).toHaveBeenCalledWith(
      "beneficiaries",
      columns,
      valuesMock
    );
    expect(mockQuery).toHaveBeenCalledWith("BEGIN");
    expect(mockQuery).toHaveBeenCalledWith("COMMIT");
  });
  it("should throw an error if the number of inserted rows is different from the expected", async () => {
    mockGenerateInsertValues.mockReturnValueOnce(mockInsertValues);
    mockQuery.mockImplementation(() => ({ rowCount: 2 }));

    await expect(
      createBeneficiaries({ beneficiaries: beneficiariesToCreateMock }, date)
    ).rejects.toThrow(
      "Error inserting beneficiaries. Expected 3 rows to be inserted but 2 were inserted."
    );
    expect(generateInsertValues).toBeCalledWith(
      "beneficiaries",
      columns,
      valuesMock
    );
    expect(mockQuery).toHaveBeenCalledWith("BEGIN");
    expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
  });
});
