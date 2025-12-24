import { ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
}: {
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

    return result;
  });
}
