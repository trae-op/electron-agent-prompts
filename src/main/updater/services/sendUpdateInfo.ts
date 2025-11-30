import { getWindow } from "../../@shared/control-window/receive.js";
import { ipcWebContentsSend } from "../../@shared/utils.js";

export function sendUpdateInfo(payload: TUpdateData) {
  const updateWindow = getWindow<TWindows["updateApp"]>("window:update-app");
  const mainWindow = getWindow<TWindows["main"]>("window:main");

  [updateWindow, mainWindow].forEach((window) => {
    if (window !== undefined) {
      ipcWebContentsSend("updateApp", window.webContents, payload);
    }
  });
}
