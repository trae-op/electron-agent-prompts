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
      width: 800,
      height: 600,
      ...(options || {}),
    },
  });
}
