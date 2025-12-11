import { ipcMainHandle } from "../@shared/utils.js";
import { deleteProject } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("deleteProject", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    return deleteProject(payload);
  });
}
