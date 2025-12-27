import { getStore } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

function getFileNameFromUrl(url?: string | null): string | undefined {
  if (url === undefined || url === null) {
    return undefined;
  }

  try {
    const { pathname } = new URL(url);
    const parts = pathname.split("/").filter(Boolean);
    return parts.pop();
  } catch (error) {
    const parts = url.split("/").filter(Boolean);
    return parts.pop();
  }
}

export function registerIpc({
  saveFoldersContent,
  getFoldersContentByTaskId,
  saveFileToStoredFolders,
  buildMarkdownContentsFromBlob,
  getMarkdownContentByProjectId,
  saveMarkdownContent,
  downloadByUrl,
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
  downloadByUrl: (url: string) => Promise<Blob | undefined>;
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

    const resolvedFileName =
      result.fileName ?? getFileNameFromUrl(result.task?.url);
    const resolvedFileBlob =
      result.fileBlob ??
      (result.task?.url ? await downloadByUrl(result.task.url) : undefined);

    if (
      resolvedFileBlob !== undefined &&
      resolvedFileName !== undefined &&
      result.task !== undefined
    ) {
      await saveFileToStoredFolders({
        file: resolvedFileBlob,
        fileName: resolvedFileName,
        taskId: String(result.task.id),
      });
    }

    if (resolvedFileBlob !== undefined && result.task !== undefined) {
      const markdownContents = await buildMarkdownContentsFromBlob(
        resolvedFileBlob
      );

      if (markdownContents.length > 0) {
        saveMarkdownContent({
          taskId: String(result.task.id),
          contents: markdownContents,
        });
      }
    }

    const projectMarkdownContent =
      getMarkdownContentByProjectId(projectIdStore);

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
        projectIdStore
      ),
    };
  });
}
