import { cacheTasks } from "../@shared/cache-responses.js";
import { setDataResponseElectronStorage } from "../@shared/services/rest-api/service.js";
import { getStore } from "../@shared/store.js";
import { buildTasksEndpoint, ipcMainHandle } from "../@shared/utils.js";
import { updateTask } from "./service.js";

function removeTaskFromResponseCache(
  projectIdValue: number,
  taskId: number
): void {
  const projectIdStore = getStore<string, string>("projectId");

  const newProjectIdString =
    projectIdValue !== undefined ? `${projectIdValue}` : undefined;

  if (
    newProjectIdString !== undefined &&
    newProjectIdString !== projectIdStore
  ) {
    const parsedProjectIdStore = Number(projectIdStore);

    if (!Number.isNaN(parsedProjectIdStore)) {
      const cachedCurrentProjectTasks = cacheTasks(parsedProjectIdStore);

      if (cachedCurrentProjectTasks !== undefined) {
        const tasksWithoutUpdated = cachedCurrentProjectTasks.filter(
          (task) => String(task.id) !== String(taskId)
        );

        setDataResponseElectronStorage(
          buildTasksEndpoint(parsedProjectIdStore),
          tasksWithoutUpdated
        );
      }
    }
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
  saveConnectionInstruction,
  deleteConnectionInstruction: _deleteConnectionInstruction,
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
  downloadByUrl: (url: string) => Promise<Blob | undefined>;
  saveConnectionInstruction: (payload: {
    projectId: string;
    taskId: string;
    ide?: string;
  }) => void;
  deleteConnectionInstruction: (taskId: string, projectId?: string) => void;
  getConnectionInstructionByTaskId: (
    taskId: string,
    projectId?: string | undefined
  ) => { ide?: string } | undefined;
  connectionInstruction: (payload: {
    fileBlob?: Blob;
    ide?: string;
  }) => Promise<void>;
}): void {
  ipcMainHandle("updateTask", async (payload) => {
    if (payload === undefined || payload.projectId === undefined) {
      return undefined;
    }

    const result = await updateTask(payload);

    if (result === undefined) {
      return undefined;
    }

    if (result.task === undefined) {
      return undefined;
    }

    if (payload.folderPaths !== undefined) {
      const projectIdValue = payload.projectId ?? result.task.projectId;

      if (projectIdValue !== undefined) {
        saveFoldersContent({
          projectId: `${projectIdValue}`,
          taskId: `${result.task.id}`,
          folders: payload.folderPaths,
        });
      }
    }

    const projectIdValue = payload.projectId ?? result.task.projectId;

    const projectIdStore = getStore<string, string>("projectId");
    if (projectIdStore === undefined) {
      return undefined;
    }

    if (String(projectIdStore).trim() !== String(projectIdValue).trim()) {
      removeTaskFromResponseCache(projectIdValue, result.task.id);
    }

    const resolvedFileName = result.task?.name;
    const resolvedFileBlob =
      result.fileBlob ??
      (result.task.url ? await downloadByUrl(result.task.url) : undefined);

    if (resolvedFileBlob !== undefined && resolvedFileName !== undefined) {
      await saveFileToStoredFolders({
        file: resolvedFileBlob,
        fileName: resolvedFileName,
        taskId: String(result.task.id),
      });
    }

    if (resolvedFileBlob !== undefined) {
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

    const connectionInstructionProjectId = projectIdValue ?? projectIdStore;
    const normalizedIde = payload.ide?.trim();

    if (
      normalizedIde !== undefined &&
      normalizedIde.length > 0 &&
      connectionInstructionProjectId !== undefined
    ) {
      saveConnectionInstruction({
        projectId: String(connectionInstructionProjectId),
        taskId: String(result.task.id),
        ide: normalizedIde,
      });

      if (resolvedFileBlob !== undefined) {
        await connectionInstruction({
          fileBlob: resolvedFileBlob,
          ide: normalizedIde,
        });
      }
    }

    const projectMarkdownContent =
      getMarkdownContentByProjectId(projectIdStore);

    const connectionInstructionPayload = getConnectionInstructionByTaskId(
      String(result.task.id),
      projectIdStore
    );

    return {
      ...result.task,
      content:
        projectMarkdownContent !== undefined
          ? projectMarkdownContent[String(result.task.id)]?.map(
              (task) => task.content
            ) ?? []
          : undefined,
      foldersContentFiles: getFoldersContentByTaskId(
        String(result.task.id),
        projectIdStore
      ),
      ide: connectionInstructionPayload?.ide,
    };
  });
}
