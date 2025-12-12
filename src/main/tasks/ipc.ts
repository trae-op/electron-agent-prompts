import { ipcMainOn } from "../@shared/utils.js";
import { cacheTasks } from "../@shared/cache-responses.js";
import { getTasks } from "./service.js";

export function registerIpc(): void {
  ipcMainOn("tasks", async (event: Electron.IpcMainEvent) => {
    const tasksFromCache = cacheTasks();

    if (tasksFromCache !== undefined) {
      event.reply("tasks", {
        tasks: tasksFromCache,
      });
    }

    const tasks = await getTasks();

    if (tasks !== undefined) {
      event.reply("tasks", {
        tasks,
      });
    }
  });
}
