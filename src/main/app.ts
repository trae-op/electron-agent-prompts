import { app, BrowserWindow, Menu } from "electron";
import dotenv from "dotenv";
import path from "node:path";
import { buildMenu, getMenu } from "./@shared/menu/menu.js";
import { isDev } from "./@shared/utils.js";
import { setStore } from "./@shared/store.js";
import { createWindow } from "./@shared/control-window/create.js";
import { destroyWindows } from "./@shared/control-window/destroy.js";
import { initNotification } from "./@shared/notification.js";
import { destroyTray, getTrayMenu, buildTray } from "./@shared/tray/tray.js";
import { setFeedURL } from "./updater/services/win/setFeedURL.js";
import { controlUpdater } from "./updater/services/win/controlUpdater.js";
import { registerIpc as registerIpcAppVersion } from "./app-version/ipc.js";
import { registerIpc as registerIpcUpdater } from "./updater/ipc.js";
import { registerIpc as registerIpcPreload } from "./app-preload/ipc.js";
import { registerIpc as registerIpcAuth } from "./auth/ipc.js";
import { registerIpc as registerIpcUser } from "./user/ipc.js";
import { crash } from "./crash/service.js";
import { menu } from "./config.js";

const envPath = path.join(process.resourcesPath, ".env");
dotenv.config(!isDev() ? { path: envPath } : undefined);

app.disableHardwareAcceleration();

Menu.setApplicationMenu(null);

setFeedURL();

crash();

app.on("ready", async () => {
  const mainWindow = createWindow<TWindows["main"]>({
    hash: "window:main",
    isCache: true,
    options: {
      show: false,
      resizable: false,
      width: 700,
      height: 600,
    },
  });

  initNotification();

  buildTray(
    getTrayMenu().map((item) => {
      if (item.name === "show") {
        item.click = () => {
          mainWindow.show();

          if (app.dock) {
            app.dock.show();
          }
        };
      }

      return item;
    })
  );

  buildMenu(
    getMenu().map((item) => {
      if (item.name === "app") {
        item.submenu = [
          {
            label: menu.labels.devTools,
            click: () => mainWindow.webContents.openDevTools(),
          },
          {
            label: menu.labels.quit,
            click: () => app.quit(),
          },
        ];
      }

      return item;
    })
  );

  registerIpcAuth();
  registerIpcUser();
  registerIpcPreload();
  registerIpcAppVersion();
  registerIpcUpdater();

  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let isWillClose = false;

  mainWindow.on("close", (event) => {
    if (isWillClose) {
      return;
    }

    event.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", async () => {
    isWillClose = true;

    destroyTray();
    destroyWindows();
  });

  mainWindow.on("show", () => {
    setStore("/", mainWindow);
    isWillClose = false;
  });
}

controlUpdater();
