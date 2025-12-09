import { ipcMainOn } from "../@shared/utils.js";
import { createProject } from "./service.js";

export function registerIpc(): void {
  ipcMainOn("createProject", async (event: Electron.IpcMainEvent, payload) => {
    const result = await createProject(payload);

    event.reply("createProject", result);
  });
}
