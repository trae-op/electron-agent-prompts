import { getStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
  getFoldersContentByTaskId,
}: {
  getFoldersContentByTaskId: (
    taskId: string,
    projectId?: string | undefined
  ) => string[] | undefined;
  saveFoldersContent: (payload: {
    projectId: string;
    taskId: string;
    folders: string[];
  }) => void;
}): void {
  ipcMainHandle("updateTask", async (payload) => {
    if (payload === undefined) {
      return undefined;
    }

    const result = await updateTask(payload);

    if (result === undefined) {
      return undefined;
    }

    if (result !== undefined && payload.folderPaths !== undefined) {
      const projectIdValue = payload.projectId ?? result.projectId;

      if (projectIdValue !== undefined) {
        saveFoldersContent({
          projectId: `${projectIdValue}`,
          taskId: `${result.id}`,
          folders: payload.folderPaths,
        });
      }
    }

    const projectIdStore = getStore<string, string>("projectId");
    if (projectIdStore === undefined) {
      return undefined;
    }

    return {
      ...result,
      foldersContentFiles: getFoldersContentByTaskId(
        String(result.id),
        projectIdStore
      ),
    };
  });
}
