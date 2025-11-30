import { app, shell } from "electron";
import { folders, messages } from "../../../config.js";
import type { TPromiseOpenFolder } from "./types.js";
import path from "node:path";

export async function openFolder(
  folderPath: string
): Promise<TPromiseOpenFolder> {
  try {
    await shell.openPath(folderPath);

    return {
      ok: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: error.message,
      };
    } else {
      return {
        ok: false,
        message: messages.autoUpdater.errorOpenFolder,
      };
    }
  }
}

export function openLatestVersion(updateFile: string) {
  const folderPath = path.join(app.getPath("downloads"), folders.download);
  openFolder(folderPath + "/" + updateFile);
}
