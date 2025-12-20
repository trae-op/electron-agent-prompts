import { cacheTask } from "../@shared/cache-responses.js";
import { ipcMainOn } from "../@shared/utils.js";
import { getTask } from "./service.js";
import { openWindow } from "./window.js";

export function registerIpc(): void {
  ipcMainOn("windowTask", (_, { id }) => {
    const window = openWindow({
      hash: `window:task/${id}`,
    });

    // window.webContents.toggleDevTools();

    ipcMainOn(
      "task",
      async (
        event: Electron.IpcMainEvent,
        payload: TEventPayloadSend["task"] | undefined
      ) => {
        if (payload === undefined) {
          return;
        }

        const taskFromCache = cacheTask(payload.taskId);

        if (taskFromCache !== undefined) {
          event.reply("task", {
            task: taskFromCache,
          });
        }

        const task = await getTask(payload.taskId);
        if (task !== undefined) {
          event.reply("task", {
            task,
          });
        }
      }
    );
  });
}
