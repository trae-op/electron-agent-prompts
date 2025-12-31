import { ipcMainOn } from "../@shared/utils.js";
import { cacheTasks } from "../@shared/cache-responses.js";
import { getTasks } from "./service.js";
import { getElectronStorage, getStore, setStore } from "../@shared/store.js";
import { TGetFoldersContentByProjectId } from "./types.js";

export function registerIpc({
  getFoldersContentByProjectId,
  getConnectionInstructionByProjectId,
}: TGetFoldersContentByProjectId): void {
  const tasksCollect = (tasks: TTask[]) => {
    const projectIdStore = getStore<string, string>("projectId");

    if (projectIdStore === undefined) {
      return;
    }

    const foldersContentFiles = getFoldersContentByProjectId(projectIdStore);

    const markdownContent = (getElectronStorage("markdownContent") ??
      {}) as Record<string, Record<string, TMarkdownContent[]>>;
    const projectMarkdown =
      markdownContent[projectIdStore] ??
      ({} as Record<string, TMarkdownContent[]>);

    const content: Record<string, string[]> = {};
    for (const key in projectMarkdown) {
      if (projectMarkdown[key] !== undefined) {
        content[key] = projectMarkdown[key].map(
          (item: TMarkdownContent) => item.content
        );
      }
    }

    const connectionInstructions =
      getConnectionInstructionByProjectId(projectIdStore);

    return tasks.map((task) => ({
      ...task,
      content: content[task.id + ""] ?? [],
      foldersContentFiles:
        foldersContentFiles && foldersContentFiles[task.id + ""]
          ? foldersContentFiles[task.id + ""]
          : [],
      ide: connectionInstructions?.[task.id + ""]?.ide,
    }));
  };

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
        event.reply("tasks", {
          tasks: tasksCollect(tasksFromCache),
        });
      }

      const tasks = await getTasks(projectId);

      if (tasks !== undefined) {
        event.reply("tasks", {
          tasks: tasksCollect(tasks),
        });
      }
    }
  );
}
