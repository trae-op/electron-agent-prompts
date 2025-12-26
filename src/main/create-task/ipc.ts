import { ipcMainHandle } from "../@shared/utils.js";
import { createTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
  getFoldersContentByTaskId,
  saveFileToStoredFolders,
  buildMarkdownContentsFromBlob,
  getMarkdownContentByProjectId,
  saveMarkdownContent,
}: {
  buildMarkdownContentsFromBlob(fileBlob: Blob): Promise<TMarkdownContent[]>;
  getMarkdownContentByProjectId(projectId?: string | undefined):
    | {
        [key: string]: TMarkdownContent[] | undefined;
      }
    | undefined;
  saveMarkdownContent(payload: {
    taskId: string;
    contents: TMarkdownContent[];
  }): void;
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

    if (result.fileBlob !== undefined && result.task !== undefined) {
      const markdownContents = await buildMarkdownContentsFromBlob(
        result.fileBlob
      );

      if (markdownContents.length > 0) {
        saveMarkdownContent({
          taskId: String(result.task.id),
          contents: markdownContents,
        });
      }
    }

    const projectMarkdownContent = getMarkdownContentByProjectId(
      payload.projectId
    );

    return {
      ...result.task,
      content:
        projectMarkdownContent !== undefined
          ? projectMarkdownContent[String(result.task?.id)]?.map(
              (task) => task.content
            ) ?? []
          : undefined,
      foldersContentFiles: getFoldersContentByTaskId(
        String(result.task.id),
        payload.projectId
      ),
    };
  });
}
