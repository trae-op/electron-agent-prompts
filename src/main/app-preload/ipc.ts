import { ipcMainOn } from "../@shared/utils.js";
import { getWindow } from "../@shared/control-window/receive.js";
import { openWindow } from "./window.js";

export function registerIpc(): void {
  openWindow();

  ipcMainOn("windowClosePreload", async () => {
    const mainWindow = getWindow<TWindows["main"]>("window:main");
    const preloadAppWindow =
      getWindow<TWindows["preloadApp"]>("window:preload-app");
    if (preloadAppWindow !== undefined) {
      preloadAppWindow.hide();
    }

    if (mainWindow !== undefined) {
      mainWindow.show();
    }
  });
}
