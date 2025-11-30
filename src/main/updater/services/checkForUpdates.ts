import pkg from "electron-updater";
import { isDev, isPlatform } from "../../@shared/utils.js";
import { isUpdateProcess } from "./checkUpdateProcess.js";
import { controlUpdate } from "./mac/controlUpdate.js";

const { autoUpdater } = pkg;

export function checkForUpdates() {
  if (isUpdateProcess() || isDev()) {
    return;
  }

  if (isPlatform("win32")) {
    autoUpdater.checkForUpdates();
  } else {
    controlUpdate();
  }
}
