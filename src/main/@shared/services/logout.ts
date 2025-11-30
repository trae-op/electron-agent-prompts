import { deleteFromElectronStorage } from "../store.js";
import { ipcWebContentsSend } from "../utils.js";
import { getWindow } from "../control-window/receive.js";

export async function logout() {
  const mainWindow = getWindow<TWindows["main"]>("window:main");

  if (mainWindow !== undefined) {
    deleteFromElectronStorage("authToken");
    deleteFromElectronStorage("response");
    deleteFromElectronStorage("userId");
    ipcWebContentsSend("auth", mainWindow.webContents, {
      isAuthenticated: false,
    });
  }
}
