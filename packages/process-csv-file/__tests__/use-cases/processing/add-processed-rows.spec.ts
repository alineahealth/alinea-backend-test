import { addProcessedRowsAsync } from "../../../src/use-cases/processing/add-processed-rows";
import { createProcessedRowsAsync } from "../../../src/repository/processings/processed-row/processed-row";

jest.mock("../../../src/repository/processings/processed-row/processed-row");

describe("addProcessedRowsAsync", () => {
  const mockCreateProcessedRowsAsync =
    createProcessedRowsAsync as jest.MockedFunction<
      typeof createProcessedRowsAsync
    >;
  const consoleWarnMock = jest.spyOn(console, "warn");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add processed rows to the database", async () => {
    const processingId = "processing-id";
    const type = "row-type";
    const rowsToProcess: { number: number; raw: string; errors: string[] }[] = [
      { number: 1, raw: "row 1", errors: [] },
      { number: 2, raw: "row 2", errors: ["error 1", "error 2"] },
    ];

    const expectedProcessedRows = rowsToProcess.map((row) => ({
      id: expect.any(String),
      processId: processingId,
      rawNumber: row.number,
      rawContent: row.raw,
      rowType: type,
      errorReasons: row.errors,
    }));

    await addProcessedRowsAsync(processingId, type, rowsToProcess);

    expect(mockCreateProcessedRowsAsync).toHaveBeenCalledWith({
      processedRows: expectedProcessedRows,
    });
  });

  it("should throw an error when createProcessedRowsAsync fails", async () => {
    const processingId = "processing-id";
    const type = "row-type";
    const rowsToProcess: { number: number; raw: string; errors: string[] }[] = [
      { number: 1, raw: "row 1", errors: [] },
      { number: 2, raw: "row 2", errors: ["error 1", "error 2"] },
    ];

    const error = new Error("Failed to create processed rows");
    mockCreateProcessedRowsAsync.mockRejectedValueOnce(error);

    await expect(
      addProcessedRowsAsync(processingId, type, rowsToProcess)
    ).rejects.toThrow(error);
    expect(mockCreateProcessedRowsAsync).toHaveBeenCalledWith({
      processedRows: expect.any(Array),
    });
  });

  it("should not call createProcessedRowsAsync when rowsToProcess is an empty array", async () => {
    const processingId = "processing-id";
    const type = "row-type";
    const rowsToProcess: { number: number; raw: string; errors: string[] }[] =
      [];

    await addProcessedRowsAsync(processingId, type, rowsToProcess);

    expect(mockCreateProcessedRowsAsync).not.toHaveBeenCalled();
    expect(consoleWarnMock).toHaveBeenCalledWith({
      message: "No rows to process",
    });
  });
});
