import { createBeneficiariesHistory } from "../../../src/repository/beneficiaries/beneficiaries-history.create";
import { pool } from "../../../src/repository/database";
import { generateInsertValues } from "../../../src/utils/database-helpers";

jest.mock("../../../src/repository/database");
jest.mock("../../../src/utils/database-helpers");

describe("createBeneficiariesHistory", () => {
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

  it("should insert beneficiaries histories records successfully", async () => {
    const insertDate = new Date("2023-06-23T18:00:00.000Z");
    const mockInput = {
      beneficiaries: [
        {
          beneficiary_id: "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
          date: insertDate,
          action: "activate beneficiary",
          status_id: 1,
        },
        {
          beneficiary_id: "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
          date: insertDate,
          action: "update beneficiary",
          status_id: 1,
        },
      ],
    };

    const mockInsertValues: {
      text: string;
      values: (number | string | Date)[];
    } = {
      text: "INSERT INTO beneficiaries_history (beneficiary_id, date, action, status_id) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
      values: [
        "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
        insertDate,
        "activate beneficiary",
        "1",
        "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
        insertDate,
        "update beneficiary",
        "1",
      ],
    };

    mockQuery.mockImplementation(() => ({ rowCount: 2 }));
    mockGenerateInsertValues.mockReturnValueOnce(mockInsertValues);

    const result = await createBeneficiariesHistory(mockInput, insertDate);

    expect(pool).toHaveBeenCalledTimes(1);
    expect(generateInsertValues).toHaveBeenCalledWith(
      "beneficiaries_history",
      ["beneficiary_id", "date", "action", "status_id"],
      [
        [
          "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
          insertDate,
          "activate beneficiary",
          1,
        ],
        [
          "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
          insertDate,
          "update beneficiary",
          1,
        ],
      ]
    );

    expect(mockQuery).toHaveBeenCalledWith(mockInsertValues);
    expect(result).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith("BEGIN");
    expect(mockQuery).toHaveBeenCalledWith("COMMIT");
  });

  it("should throw an error if the number of inserted rows is different from the expected", async () => {
    const firstMockDate = new Date();
    const secondMockDate = new Date();
    const mockInput = {
      beneficiaries: [
        {
          beneficiary_id: "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
          date: firstMockDate,
          action: "activate beneficiary",
          status_id: 1,
        },
        {
          beneficiary_id: "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
          date: secondMockDate,
          action: "update beneficiary",
          status_id: 1,
        },
      ],
    };

    const mockInsertValues: {
      text: string;
      values: (number | string | Date)[];
    } = {
      text: "INSERT INTO beneficiaries_history (beneficiary_id, date, action, status_id) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
      values: [
        "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
        firstMockDate,
        "activate beneficiary",
        "1",
        "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
        secondMockDate,
        "update beneficiary",
        "1",
      ],
    };

    mockQuery.mockImplementation(() => ({ rowCount: 1 }));
    mockGenerateInsertValues.mockReturnValueOnce(mockInsertValues);

    await expect(createBeneficiariesHistory(mockInput)).rejects.toThrow(
      "Error inserting beneficiaries histories. Expected 2 rows to be inserted but 1 were inserted."
    );
    expect(generateInsertValues).toHaveBeenCalledWith(
      "beneficiaries_history",
      ["beneficiary_id", "date", "action", "status_id"],
      [
        [
          "78cf47fe-344f-4c53-ab64-c9ee3a01650d",
          firstMockDate,
          "activate beneficiary",
          1,
        ],
        [
          "b27f1ed1-fdc4-44ed-80a9-b7e76612da80",
          secondMockDate,
          "update beneficiary",
          1,
        ],
      ]
    );
    expect(mockQuery).toHaveBeenCalledWith(mockInsertValues);
    expect(mockQuery).toHaveBeenCalledWith("BEGIN");
    expect(mockQuery).toHaveBeenCalledWith("ROLLBACK");
  });
});
