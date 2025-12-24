import { ipcMainOn } from "../@shared/utils.js";
import { cacheTasks } from "../@shared/cache-responses.js";
import { getTasks } from "./service.js";
import { setStore } from "../@shared/store.js";

type TGetFoldersContentByProjectId = {
  getFoldersContentByProjectId: (projectId?: string | undefined) =>
    | {
        [key: string]: string[] | undefined;
      }
    | undefined;
};

function foldersContentFiles(
  getFoldersContentByProjectId: TGetFoldersContentByProjectId["getFoldersContentByProjectId"],
  tasks: TTaskWithFoldersContent[],
  projectId: string
) {
  const foldersContentFiles = getFoldersContentByProjectId(projectId + "");

  return tasks.map((task) => ({
    ...task,
    foldersContentFiles:
      foldersContentFiles && foldersContentFiles[task.id + ""]
        ? foldersContentFiles[task.id + ""]
        : [],
  }));
}

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
