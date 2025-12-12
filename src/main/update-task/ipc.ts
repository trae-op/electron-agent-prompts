import { ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("updateTask", async (payload) => {
    if (payload === undefined) {
      return undefined;
    }

    const result = await updateTask(payload);

    return result;
  });
}
