import { getStore, setStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { createTask } from "./service.js";

export function registerIpc({
  saveFoldersContent,
  getFoldersContentByTaskId,
  saveFileToStoredFolders,
  buildMarkdownContentsFromBlob,
  getMarkdownContentByProjectId,
  saveMarkdownContent,
  saveConnectionInstruction,
  getConnectionInstructionByTaskId,
  connectionInstruction,
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
  saveConnectionInstruction: (payload: {
    projectId: string;
    taskId: string;
    path?: string;
    ide?: string;
  }) => void;
  getConnectionInstructionByTaskId: (
    taskId: string,
    projectId?: string | undefined
  ) => { path: string; ide?: string } | undefined;
  connectionInstruction: () => Promise<void>;
}): void {
  ipcMainHandle("createTask", async (payload) => {
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await createTask(payload);

    if (result === undefined) {
      return undefined;
    }

    if (result.task === undefined) {
      return undefined;
    }

    if (payload.folderPaths !== undefined) {
      saveFoldersContent({
        projectId: payload.projectId,
        taskId: String(result.task.id),
        folders: payload.folderPaths,
      });
    }

    if (result.fileBlob !== undefined) {
      await saveFileToStoredFolders({
        file: result.fileBlob,
        fileName: result.task.name,
        taskId: String(result.task.id),
      });
    }

    if (result.fileBlob !== undefined) {
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

    const connectionInstructionStore = getStore<
      { path?: string; ide?: string },
      string
    >("uploadConnectionInstructionFile");

    if (connectionInstructionStore?.path) {
      saveConnectionInstruction({
        projectId: payload.projectId,
        taskId: String(result.task.id),
        path: connectionInstructionStore.path,
        ide: connectionInstructionStore.ide,
      });

      await connectionInstruction();
    }

    setStore("uploadConnectionInstructionFile", {
      path: "",
      ide: connectionInstructionStore?.ide ?? "vs-code",
    });

    const projectMarkdownContent = getMarkdownContentByProjectId(
      payload.projectId
    );

    const connectionInstructionPayload = getConnectionInstructionByTaskId(
      String(result.task.id),
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
      pathConnectionInstruction: connectionInstructionPayload?.path,
      ide: connectionInstructionPayload?.ide,
    };
  });
}
