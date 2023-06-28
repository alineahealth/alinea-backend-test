import { getAllCompanies } from "../src/list-companies.find";
import { pool } from "../src/database";

jest.mock("../src/database");

describe("getAllCompanies", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest
        .fn()
        .mockResolvedValue({ query: mockQuery, release: jest.fn() }),
      end: jest.fn(),
    } as any);
  });

  test("should return a list of companies", async () => {
    const tracingID = "test-tracing-id";

    const listCompaniesMock = [
      {
        id: "8g342ac1-3d4b-4963-bde5-ac6f5912a789",
        name: "Alinea Health",
      },
      {
        id: "7g322ac1-3j4b-4963-bde2-ac6f5912a749",
        name: "CSN",
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: listCompaniesMock });

    const result = await getAllCompanies({ tracingId: tracingID });

    const resultQuery = `SELECT id, name FROM companies`;

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(resultQuery)
    );
    expect(result).toEqual({
      items: listCompaniesMock,
    });
  });

  test("should throw an error if the database query fails", async () => {
    const tracingID = "test-tracing-id";
    const errorMessage = "Database query failed";

    mockQuery.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getAllCompanies({ tracingId: tracingID })).rejects.toThrow(
      errorMessage
    );
  });
});
