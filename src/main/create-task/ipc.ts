import { ipcMainHandle } from "../@shared/utils.js";
import { createTask } from "./service.js";

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
  ipcMainHandle("createTask", async (payload) => {
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await createTask(payload);

    if (result === undefined) {
      return undefined;
    }

    if (result.task !== undefined && payload.folderPaths !== undefined) {
      saveFoldersContent({
        projectId: payload.projectId,
        taskId: String(result.task.id),
        folders: payload.folderPaths,
      });
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
        payload.projectId
      ),
    };
  });
}
