import { app } from "electron";
import pkg from "electron-updater";
import { destroyWindows } from "../@shared/control-window/destroy.js";
import { buildTray, destroyTray, getTrayMenu } from "../@shared/tray/tray.js";
import { ipcMainOn } from "../@shared/utils.js";
import { openLatestVersion } from "./services/mac/openLatestVersion.js";
import { openWindow } from "./window.js";
import { checkForUpdates } from "./services/checkForUpdates.js";

const { autoUpdater } = pkg;

export function registerIpc(): void {
  const items = getTrayMenu();

  buildTray(
    items.map((item) => {
      if (item.name === "check-update") {
        item.click = () => {
          openWindow();
        };
      }

      return item;
    })
  );

  ipcMainOn("restart", () => {
    autoUpdater.quitAndInstall();
  });

  ipcMainOn("checkForUpdates", () => {
    checkForUpdates();
  });

  ipcMainOn("openLatestVersion", (_, { updateFile }) => {
    openLatestVersion(updateFile);
    destroyTray();
    destroyWindows();
    app.quit();
  });
}
