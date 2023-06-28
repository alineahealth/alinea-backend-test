import { addSchemaErrorsAsync } from "../../../src/use-cases/processing/add-schema-erros";
import { createProcessSchemaErrorAsync } from "../../../src/repository/processings/process-schema-error/process-schema-error";
import { IRowWithError } from "../../../src/types/types";

jest.mock(
  "../../../src/repository/processings/process-schema-error/process-schema-error"
);

describe("addSchemaErrorsAsync", () => {
  const mockCreateProcessSchemaErrorAsync =
    createProcessSchemaErrorAsync as jest.MockedFunction<
      typeof createProcessSchemaErrorAsync
    >;
  const consoleWarnMock = jest.spyOn(console, "warn");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add schema errors to the database", async () => {
    const processId = "process-id";
    const rowWithErrors: IRowWithError[] = [
      { raw: "row 1", number: 4, errors: ["error 1"] },
      { raw: "row 2", number: 4, errors: ["error 2", "error 3"] },
    ];

    const expectedSchemaErrors = rowWithErrors.map((row) => ({
      id: expect.any(String),
      processId,
      rawContent: row.raw,
      errorReasons: row.errors,
    }));

    await addSchemaErrorsAsync(processId, rowWithErrors);

    expect(mockCreateProcessSchemaErrorAsync).toHaveBeenCalledWith({
      processSchemaError: expectedSchemaErrors,
    });
  });

  it("should throw an error when createProcessSchemaErrorAsync fails", async () => {
    const processId = "process-id";
    const rowWithErrors: IRowWithError[] = [
      { raw: "row 1", number: 4, errors: ["error 1"] },
      { raw: "row 2", number: 4, errors: ["error 2", "error 3"] },
    ];

    const error = new Error("Failed to create schema errors");
    mockCreateProcessSchemaErrorAsync.mockRejectedValueOnce(error);

    await expect(
      addSchemaErrorsAsync(processId, rowWithErrors)
    ).rejects.toThrow(error);
    expect(mockCreateProcessSchemaErrorAsync).toHaveBeenCalledWith({
      processSchemaError: expect.any(Array),
    });
  });

  it("should not call createProcessSchemaErrorAsync when rowWithErrors is an empty array", async () => {
    const processId = "process-id";
    const rowWithErrors: { number: number; raw: string; errors: string[] }[] =
      [];

    await addSchemaErrorsAsync(processId, rowWithErrors);

    expect(mockCreateProcessSchemaErrorAsync).not.toHaveBeenCalled();
    expect(consoleWarnMock).toHaveBeenCalledWith({
      message: "No rows with schema errors to process",
    });
  });
});
