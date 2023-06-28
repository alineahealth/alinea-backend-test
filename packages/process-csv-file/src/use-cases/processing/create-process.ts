import { randomUUID } from "crypto";
import { IProcessCreate } from "../../repository/processings/process/process.types";
import { Status } from "../../enums/status.enum";
import { createNewProcessAsync } from "../../repository/processings/process/process";
import { createProcessHistoryAsync } from "../../repository/processings/process-history/process-history";
import { getIndexFromEnumValue } from "../../utils/enum-helpers";

export const createProcessAsync = async (
  newProcess: IProcessCreate,
  status: Status
) => {
  await createNewProcessAsync({
    process: newProcess,
  });

  await createProcessHistoryAsync({
    processHistory: {
      id: randomUUID(),
      processId: newProcess.id,
      statusId: getIndexFromEnumValue(status, Status),
    },
  });
};
