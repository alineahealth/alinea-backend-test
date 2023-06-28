import { randomUUID } from "crypto";
import { Status } from "../../enums/status.enum";
import { createProcessHistory } from "../../repository/processings/process-history/process-history.create";
import { updateProcessAsync } from "../../repository/processings/process/process";
import { IProcessUpdate } from "../../repository/processings/process/process.types";
import { getIndexFromEnumValue } from "../../utils/enum-helpers";

export const updateProcessInfoAsync = async (
  processId: string,
  processToUpdate: IProcessUpdate,
  status: Status
): Promise<void> => {
  await updateProcessAsync({
    process: processToUpdate,
  });

  await createProcessHistory({
    processHistory: {
      id: randomUUID(),
      processId: processId,
      statusId: getIndexFromEnumValue(status, Status),
    },
  });
};
