import { getStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
  getFoldersContentByTaskId,
  saveFileToStoredFolders,
}: {
  saveFileToStoredFolders(payload: {
    file: Blob;
    fileName: string;
    taskId: string;
  }): Promise<void>;
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
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await updateTask(payload);

    if (result === undefined) {
      return undefined;
    }

    if (result.task !== undefined && payload.folderPaths !== undefined) {
      const projectIdValue = payload.projectId ?? result.task.projectId;

      if (projectIdValue !== undefined) {
        saveFoldersContent({
          projectId: `${projectIdValue}`,
          taskId: `${result.task.id}`,
          folders: payload.folderPaths,
        });
      }
    }

    const projectIdStore = getStore<string, string>("projectId");
    if (projectIdStore === undefined) {
      return undefined;
    }

    if (
      result.fileBlob !== undefined &&
      result.fileName !== undefined &&
      result.task !== undefined
    ) {
      await saveFileToStoredFolders({
        file: result.fileBlob,
        fileName: result.fileName,
        taskId: String(result.task.id),
      });
    }

    return {
      ...result.task,
      foldersContentFiles: getFoldersContentByTaskId(
        String(result.task.id),
        projectIdStore
      ),
    };
  });
}
