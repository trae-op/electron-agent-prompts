import { ipcMainOn } from "../@shared/utils.js";
import { cacheTasks } from "../@shared/cache-responses.js";
import { foldersContentFiles, getTasks } from "./service.js";
import { setStore } from "../@shared/store.js";
import { TGetFoldersContentByProjectId } from "./types.js";

export function registerIpc({
  getFoldersContentByProjectId,
}: TGetFoldersContentByProjectId): void {
  ipcMainOn(
    "tasks",
    async (
      event: Electron.IpcMainEvent,
      payload: TEventPayloadSend["tasks"] | undefined
    ) => {
      const projectId = payload?.projectId;

      setStore("projectId", projectId);

      if (projectId === undefined) {
        event.reply("tasks", { projectId: -1, tasks: [] });
        return;
      }

      const tasksFromCache = cacheTasks(projectId);

      if (tasksFromCache !== undefined) {
        // const foldersContent = getFoldersContentByProjectId(projectId + "");
        // console.log("foldersContentFiles", foldersContent);

        event.reply("tasks", {
          tasks: foldersContentFiles(
            getFoldersContentByProjectId,
            tasksFromCache,
            projectId + ""
          ),
        });
      }

      const tasks = await getTasks(projectId);

      if (tasks !== undefined) {
        event.reply("tasks", {
          tasks: foldersContentFiles(
            getFoldersContentByProjectId,
            tasks,
            projectId + ""
          ),
        });
      }
    }
  );
}
