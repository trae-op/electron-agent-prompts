import { app, Menu, Tray } from "electron";
import path from "node:path";
import { getAssetsPath } from "../path-resolver.js";
import { isPlatform } from "../utils.js";
import { menu, icons } from "../../config.js";
import type { TItem } from "./types.js";

let tray: Tray | undefined = undefined;

const defaultMenu: TItem[] = [
  {
    label: menu.labels.showApp,
    name: "show",
  },
  {
    label: menu.labels.checkUpdate,
    name: "check-update",
  },
  {
    label: menu.labels.quit,
    name: "quit",
    click: () => app.quit(),
  },
];

export function getTrayMenu(): TItem[] {
  return defaultMenu;
}

export function buildTray(items?: TItem[]): void {
  if (tray === undefined) {
    tray = new Tray(
      path.join(
        getAssetsPath(),
        isPlatform("darwin") ? icons.trayIconTemplate : icons.trayIcon
      )
    );
  }

  tray.setContextMenu(
    Menu.buildFromTemplate(items !== undefined ? items : defaultMenu)
  );
}

export function destroyTray(): void {
  if (tray !== undefined) {
    tray.destroy();
    tray = undefined;
  }
}
