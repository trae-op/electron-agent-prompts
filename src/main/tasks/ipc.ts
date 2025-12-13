import { ipcMainOn } from "../@shared/utils.js";
import { cacheTasks } from "../@shared/cache-responses.js";
import { getTasks } from "./service.js";

export function registerIpc(): void {
  ipcMainOn(
    "tasks",
    async (
      event: Electron.IpcMainEvent,
      payload: TEventPayloadSend["tasks"] | undefined
    ) => {
      const projectId = payload?.projectId;

      if (projectId === undefined) {
        event.reply("tasks", { projectId: -1, tasks: [] });
        return;
      }

      const tasksFromCache = cacheTasks(projectId);

      if (tasksFromCache !== undefined) {
        event.reply("tasks", {
          tasks: tasksFromCache,
        });
      }

      const tasks = await getTasks(projectId);

      if (tasks !== undefined) {
        event.reply("tasks", {
          tasks,
        });
      }
    }
  );
}
