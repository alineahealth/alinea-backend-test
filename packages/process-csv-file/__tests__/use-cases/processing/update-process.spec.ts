import { updateProcessInfoAsync } from "../../../src/use-cases/processing/update-process";
import { getIndexFromEnumValue } from "../../../src/utils/enum-helpers";
import { Status } from "../../../src/enums/status.enum";
import { IProcessUpdate } from "../../../src/repository/processings/process/process.types";
import { updateProcessAsync } from "../../../src/repository/processings/process/process";
import { createProcessHistory } from "../../../src/repository/processings/process-history/process-history.create";

jest.mock("crypto");
jest.mock("../../../src/utils/enum-helpers");
jest.mock("../../../src/repository/processings/process/process");
jest.mock(
  "../../../src/repository/processings/process-history/process-history.create"
);

describe("updateProcessInfoAsync", () => {
  const mockUpdateProcessAsync = updateProcessAsync as jest.MockedFunction<
    typeof updateProcessAsync
  >;
  const mockCreateProcessHistoryAsync =
    createProcessHistory as jest.MockedFunction<typeof createProcessHistory>;
  const mockGetIndexFromEnumValue =
    getIndexFromEnumValue as jest.MockedFunction<typeof getIndexFromEnumValue>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the process and create a process history", async () => {
    const processId = "process-id";
    const processToUpdate: IProcessUpdate = {
      id: "process-id",
      currentStatus: "updated",
      failedRows: 10,
      updatedAt: new Date(),
      updatedRows: 50,
    };
    const status = Status.PROCESSED_WITH_SUCCESS;
    const processHistoryId = "process-history-id";
    const statusIndex = 2;

    jest
      .spyOn(require("crypto"), "randomUUID")
      .mockReturnValueOnce(processHistoryId);
    mockGetIndexFromEnumValue.mockReturnValueOnce(statusIndex);

    await updateProcessInfoAsync(processId, processToUpdate, status);

    expect(mockUpdateProcessAsync).toHaveBeenCalledWith({
      process: processToUpdate,
    });

    expect(mockCreateProcessHistoryAsync).toHaveBeenCalledWith({
      processHistory: {
        id: processHistoryId,
        processId,
        statusId: statusIndex,
      },
    });

    expect(getIndexFromEnumValue).toHaveBeenCalledWith(status, Status);
  });

  it("should throw an error when updateProcessAsync fails", async () => {
    const processId = "process-id";
    const processToUpdate: IProcessUpdate = {
      id: "process-id",
      currentStatus: "updated",
      failedRows: 10,
      updatedAt: new Date(),
      updatedRows: 50,
    };
    const status = Status.PROCESSED_WITH_ERRORS;

    const error = new Error("Failed to update process");
    mockUpdateProcessAsync.mockRejectedValueOnce(error);

    await expect(
      updateProcessInfoAsync(processId, processToUpdate, status)
    ).rejects.toThrow(error);

    expect(mockUpdateProcessAsync).toHaveBeenCalledWith({
      process: processToUpdate,
    });

    expect(mockCreateProcessHistoryAsync).not.toHaveBeenCalled();
  });

  it("should throw an error when getIndexFromEnumValue fails", async () => {
    const processId = "process-id";
    const processToUpdate: IProcessUpdate = {
      id: "process-id",
      currentStatus: "updated",
      failedRows: 10,
      updatedAt: new Date(),
      updatedRows: 50,
    };
    const status = Status.PROCESSED_WITH_ERRORS;

    const error = new Error("Failed to get index from enum value");
    mockGetIndexFromEnumValue.mockImplementationOnce(() => {
      throw error;
    });

    await expect(
      updateProcessInfoAsync(processId, processToUpdate, status)
    ).rejects.toThrow(error);

    expect(mockUpdateProcessAsync).toHaveBeenCalledWith({
      process: processToUpdate,
    });

    expect(mockCreateProcessHistoryAsync).not.toHaveBeenCalled();
    expect(mockGetIndexFromEnumValue).toHaveBeenCalledWith(status, Status);
  });
});
