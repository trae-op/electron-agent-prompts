import { app } from "electron";
import { ipcMainHandle } from "../@shared/utils.js";

export function registerIpc(): void {
  const currentVersion = app.getVersion();

  ipcMainHandle("getVersion", () => currentVersion);
}
