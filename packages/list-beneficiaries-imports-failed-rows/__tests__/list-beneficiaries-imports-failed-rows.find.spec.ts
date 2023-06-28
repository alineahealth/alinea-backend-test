import { listBeneficiariesImportsFailedRowsFind } from "../src/list-beneficiaries-imports-failed-rows.find";
import { pool } from "../src/database";

jest.mock("../src/database");

describe("listBeneficiariesImportsFailedRowsFind", () => {
  const mockPool = pool as jest.MockedFunction<typeof pool>;
  const mockQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.mockReturnValue({
      connect: jest.fn().mockResolvedValue({ query: mockQuery }),
    } as any);
  });

  test("should return a list of beneficiaries imports result failed rows", async () => {
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = "test-tracing-id";
    const totalItems = 2;
    const totalPages = 1;
    const processIdMock = "d1aec1bd-5ffe-4699-8a39-a6798c3b1844";

    const failedRowsMock = [
      {
        raw_content:
          "Titular,123321,test,123321,123321,11123456789,Rivaldo Maciel,0209/1998,masculino,rivaldo.maciel@alineahealth.com.br",
      },
      {
        raw_content:
          ",123321,test,123321,123321,11123456789,Luís Miguel,0 02/09/1996,masculino,luís.miguel@alineahealth.com.br",
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: failedRowsMock });
    mockQuery.mockResolvedValueOnce({ rows: [{ total: totalItems }] });

    const result = await listBeneficiariesImportsFailedRowsFind({
      itemsPerPage,
      page,
      tracingID,
      processId: processIdMock,
    });

    const resultQuery = `
    SELECT raw_content
    FROM (
      SELECT raw_content, 'processed_rows' as source
      FROM processed_rows
      WHERE process_id = $1
      UNION ALL
      SELECT raw_content, 'processing_schema_errors' as source
      FROM processing_schema_errors
      WHERE process_id = $1
    ) AS data
    ORDER BY source
    OFFSET $2 LIMIT $3;
  `;
    const countQuery = `
    SELECT COUNT(raw_content) as total
    FROM (
      SELECT raw_content
      FROM processed_rows
      WHERE process_id = $1
      UNION ALL
      SELECT raw_content
      FROM processing_schema_errors
      WHERE process_id = $1
    ) AS data;
  `;

    expect(mockPool).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(resultQuery),
      [processIdMock, 0, 10]
    );
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(countQuery),
      [processIdMock]
    );
    expect(result).toEqual({
      totalItems,
      totalPages,
      itemsPerPage,
      items: failedRowsMock,
    });
  });

  test("should throw an error if the database query fails", async () => {
    const itemsPerPage = 10;
    const page = 1;
    const tracingID = "test-tracing-id";
    const errorMessage = "Database query failed";
    const processIdMock = "d1aec1bd-5ffe-4699-8a39-a6798c3b1844";

    mockQuery.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      listBeneficiariesImportsFailedRowsFind({
        itemsPerPage,
        page,
        tracingID,
        processId: processIdMock,
      })
    ).rejects.toThrow(errorMessage);
  });
});
