import { dialog } from "electron";
import { ipcMainHandle } from "../@shared/utils.js";

export function registerIpc(): void {
  ipcMainHandle("selectFolders", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"],
    });

    return result.canceled ? [] : result.filePaths;
  });
}
