import { getAllInsurersQueryAsync } from '../src/list-insurers.find';
import { pool } from "../src/database";

jest.mock("../src/database");

describe("getAllInsurersQueryAsync", () => {
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

  test("should return a list of insurers", async () => {
    const tracingID = "test-tracing-id";

    const listInsurersMock = [
      {
        id: 1,
        name: "OMINT",
      },
      {
        id: 2,
        name: "PORTO SEGURO",
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: listInsurersMock });

    const result = await getAllInsurersQueryAsync({ tracingId: tracingID });

    const resultQuery = `SELECT * FROM insurers`;

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(resultQuery)
    );
    expect(result).toEqual({
      items: listInsurersMock,
    });
  });

  test("should throw an error if the database query fails", async () => {
    const tracingID = "test-tracing-id";
    const errorMessage = "Database query failed";

    mockQuery.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getAllInsurersQueryAsync({ tracingId: tracingID })).rejects.toThrow(
      errorMessage
    );
  });
});
