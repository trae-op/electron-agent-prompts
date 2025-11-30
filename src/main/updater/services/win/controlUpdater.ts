import { dialog } from "electron";
import pkg from "electron-updater";
import { isDev, isPlatform } from "../../../@shared/utils.js";
import { notification } from "../../../@shared/notification.js";
import { messages } from "../../../config.js";
import { setStore } from "../../../@shared/store.js";
import { sendUpdateInfo } from "../sendUpdateInfo.js";

const { autoUpdater } = pkg;

export function controlUpdater(): void {
  if (isPlatform("win32") && !isDev()) {
    autoUpdater.on("checking-for-update", () => {
      setStore("updateProcess", true);
      sendUpdateInfo({
        message: messages.autoUpdater.checkingForUpdate,
        status: "checking-for-update",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-not-available", () => {
      setStore("updateProcess", false);
      sendUpdateInfo({
        message: messages.autoUpdater.updateNotAvailable,
        status: "update-not-available",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-available", (info) => {
      sendUpdateInfo({
        message: messages.autoUpdater.updateAvailable,
        status: "update-available",
        version: info.version,
        platform: process.platform,
      });
    });

    autoUpdater.on("download-progress", (progress) => {
      sendUpdateInfo({
        downloadedPercent: progress.percent.toFixed(2),
        status: "download-progress",
        platform: process.platform,
      });
    });

    autoUpdater.on("update-downloaded", (info: pkg.UpdateDownloadedEvent) => {
      setStore("updateProcess", false);
      sendUpdateInfo({
        message: messages.autoUpdater.updateDownloaded,
        status: "update-downloaded",
        version: info.version,
        platform: process.platform,
      });

      if (notification) {
        notification.title = messages.autoUpdater.notificationTitle;
        notification.body = messages.autoUpdater.notificationBody;
        notification.show();
      }
    });

    autoUpdater.on("error", (error) => {
      setStore("updateProcess", false);

      dialog.showMessageBox({
        title: messages.autoUpdater.error,
        message: error.message,
      });
    });
  }
}
