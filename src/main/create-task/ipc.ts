import { ipcMainHandle } from "../@shared/utils.js";
import { createTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
}: {
  saveFoldersContent: (payload: {
    projectId: string;
    taskId: string;
    folders: string[];
  }) => void;
}): void {
  ipcMainHandle("createTask", async (payload) => {
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await createTask(payload);

    if (result !== undefined && payload.folderPaths !== undefined) {
      saveFoldersContent({
        projectId: payload.projectId,
        taskId: String(result.id),
        folders: payload.folderPaths,
      });
    }

    return result;
  });
}
