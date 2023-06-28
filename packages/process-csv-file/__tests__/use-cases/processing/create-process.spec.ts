import { createProcessAsync } from "../../../src/use-cases/processing/create-process";
import { createNewProcessAsync } from "../../../src/repository/processings/process/process";
import { createProcessHistoryAsync } from "../../../src/repository/processings/process-history/process-history";
import { getIndexFromEnumValue } from "../../../src/utils/enum-helpers";
import { Status } from "../../../src/enums/status.enum";
import { IProcessCreate } from "../../../src/repository/processings/process/process.types";

jest.mock("crypto");
jest.mock("../../../src/utils/enum-helpers");
jest.mock("../../../src/repository/processings/process/process");
jest.mock(
  "../../../src/repository/processings/process-history/process-history"
);

describe("createProcessAsync", () => {
  const mockCreateNewProcessAsync =
    createNewProcessAsync as jest.MockedFunction<typeof createNewProcessAsync>;
  const mockCreateProcessHistoryAsync =
    createProcessHistoryAsync as jest.MockedFunction<
      typeof createProcessHistoryAsync
    >;
  const mockGetIndexFromEnumValue =
    getIndexFromEnumValue as jest.MockedFunction<typeof getIndexFromEnumValue>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new process and process history", async () => {
    const newProcess = { id: "process-id" } as IProcessCreate;
    const status = Status.PROCESSING;
    const processHistoryId = "process-history-id";

    jest
      .spyOn(require("crypto"), "randomUUID")
      .mockReturnValueOnce(processHistoryId);

    await createProcessAsync(newProcess, status);

    expect(mockCreateNewProcessAsync).toHaveBeenCalledWith({
      process: newProcess,
    });

    expect(mockCreateProcessHistoryAsync).toHaveBeenCalledWith({
      processHistory: {
        id: processHistoryId,
        processId: newProcess.id,
        statusId: getIndexFromEnumValue(status, Status),
      },
    });
  });

  it("should throw an error when createNewProcessAsync fails", async () => {
    const newProcess = { id: "process-id" } as IProcessCreate;
    const status = Status.PROCESSING;

    const error = new Error("Failed to create new process");
    mockCreateNewProcessAsync.mockRejectedValueOnce(error);

    await expect(createProcessAsync(newProcess, status)).rejects.toThrow(error);

    expect(mockCreateNewProcessAsync).toHaveBeenCalledWith({
      process: newProcess,
    });

    expect(mockCreateProcessHistoryAsync).not.toHaveBeenCalled();
  });

  it("should throw an error when getIndexFromEnumValue fails", async () => {
    const newProcess = { id: "process-id" } as IProcessCreate;
    const status = Status.PROCESSING;

    const error = new Error("Failed to get index from enum value");
    mockGetIndexFromEnumValue.mockImplementationOnce(() => {
      throw error;
    });

    await expect(createProcessAsync(newProcess, status)).rejects.toThrow(error);

    expect(mockCreateNewProcessAsync).toHaveBeenCalledWith({
      process: newProcess,
    });

    expect(mockCreateProcessHistoryAsync).not.toHaveBeenCalled();
    expect(mockGetIndexFromEnumValue).toHaveBeenCalledWith(status, Status);
  });
});
