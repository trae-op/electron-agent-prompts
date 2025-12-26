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
import { registerIpc as registerIpcCreateProject } from "./create-project/ipc.js";
import { registerIpc as registerIpcUpdateProject } from "./update-project/ipc.js";
import { registerIpc as registerIpcDeleteProject } from "./delete-project/ipc.js";
import { registerIpc as registerIpcProjects } from "./projects/ipc.js";
import { registerIpc as registerIpcCreateTask } from "./create-task/ipc.js";
import { registerIpc as registerIpcUpdateTask } from "./update-task/ipc.js";
import { updateTask as updateTaskService } from "./update-task/service.js";
import { registerIpc as registerIpcDeleteTask } from "./delete-task/ipc.js";
import { registerIpc as registerIpcUploadFile } from "./upload-file/ipc.js";
import { registerIpc as registerIpcTask } from "./task/ipc.js";
import {
  saveFoldersContent,
  deleteFoldersContent,
  deleteProjectFoldersContent,
  getFoldersContentByProjectId,
  getFoldersContentByTaskId,
  saveFileToStoredFolders,
  buildMarkdownContentsFromBlob,
  getMarkdownContentByProjectId,
  saveMarkdownContent,
} from "./task/service.js";
import { registerIpc as registerIpcTasks } from "./tasks/ipc.js";
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
      ...(!isDev() ? { resizable: false } : {}),
      width: 800,
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
  registerIpcProjects();
  registerIpcTasks({
    getFoldersContentByProjectId,
  });
  registerIpcCreateProject();
  registerIpcUpdateProject();
  registerIpcDeleteProject({
    deleteProjectFoldersContent,
  });
  registerIpcCreateTask({
    getFoldersContentByTaskId,
    saveFoldersContent,
    saveFileToStoredFolders,
    buildMarkdownContentsFromBlob,
    getMarkdownContentByProjectId,
    saveMarkdownContent,
  });
  registerIpcUpdateTask({
    getFoldersContentByTaskId,
    saveFoldersContent,
    saveFileToStoredFolders,
    buildMarkdownContentsFromBlob,
    getMarkdownContentByProjectId,
    saveMarkdownContent,
  });
  registerIpcDeleteTask({
    deleteFoldersContent,
  });
  registerIpcUploadFile();
  registerIpcPreload();
  registerIpcAppVersion();
  registerIpcUpdater();
  registerIpcTask({
    updateTask: updateTaskService,
  });

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
