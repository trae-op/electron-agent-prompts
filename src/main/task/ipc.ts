import { ipcMainOn } from "../@shared/utils.js";
import { openWindow } from "./window.js";

export function registerIpc(): void {
  ipcMainOn("windowTask", (_, { id }) => {
    openWindow({
      hash: `window:task/:${id}`,
    });
  });
}
