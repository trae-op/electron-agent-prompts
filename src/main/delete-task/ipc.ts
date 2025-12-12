import { ipcMainHandle } from "../@shared/utils.js";
import { deleteTask } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("deleteTask", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    return deleteTask(payload);
  });
}
