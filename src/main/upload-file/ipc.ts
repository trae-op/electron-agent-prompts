import { setStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";

export function registerIpc(): void {
  ipcMainHandle("uploadFile", async (payload) => {
    if (payload === undefined) {
      return;
    }

    const { path } = payload;
    setStore("uploadedFilePath", path);

    return undefined;
  });
}
