import { ipcMainHandle } from "../@shared/utils.js";
import { updateProject } from "./service.js";

export function registerIpc(): void {
  ipcMainHandle("updateProject", async (payload) => {
    if (payload === undefined) {
      return undefined;
    }

    const result = await updateProject(payload);

    return result;
  });
}
