import { ipcMainHandle } from "../@shared/utils.js";
import { createProject } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("createProject", async (payload) => {
    if (payload === undefined) {
      return undefined;
    }

    const result = await createProject(payload);

    return result;
  });
}
