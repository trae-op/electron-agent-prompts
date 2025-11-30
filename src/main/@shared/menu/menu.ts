import { Menu } from "electron";
import { isPlatform } from "../utils.js";
import { menu } from "../../config.js";
import { TItem } from "./types.js";

const defaultMenu: TItem[] = [
  {
    label: isPlatform("darwin") ? undefined : menu.labels.app,
    name: "app",
    submenu: [
      {
        label: menu.labels.devTools,
      },
      {
        label: menu.labels.quit,
      },
    ],
  },
  {
    label: "Edit",
    name: "edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteAndMatchStyle" },
      { role: "delete" },
      { role: "selectAll" },
    ],
  },
];

export function getMenu(): TItem[] {
  return defaultMenu;
}

export function buildMenu(items?: TItem[]): void {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(items !== undefined ? items : defaultMenu)
  );
}
