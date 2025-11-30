import { ipcMainOn } from "../@shared/utils.js";
import { getUserById } from "./service.js";
import { getElectronStorage } from "../@shared/store.js";
import { cacheUser } from "../@shared/cache-responses.js";

export function registerIpc(): void {
  ipcMainOn("user", async (event: Electron.IpcMainEvent) => {
    const userId = getElectronStorage("userId");
    const userFromCache = cacheUser(userId);

    if (userFromCache !== undefined) {
      event.reply("user", {
        user: userFromCache,
      });
    }

    const user = userId ? await getUserById(userId) : undefined;
    if (user !== undefined) {
      event.reply("user", {
        user,
      });
    }
  });
}
