import type { BrowserWindow } from "electron";
import { createWindow } from "../@shared/control-window/create.js";

export function openWindow({
  hash,
  options,
}: TParamOpenWindows): BrowserWindow {
  return createWindow({
    hash,
    isCache: true,
    options: {
      alwaysOnTop: true,
      width: 600,
      height: 600,
      ...(options || {}),
    },
  });
}
