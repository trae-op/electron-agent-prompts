import { ipcMainHandle } from "../@shared/utils.js";
import { createTask } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("createTask", async (payload) => {
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await createTask(payload);

    return result;
  });
}
