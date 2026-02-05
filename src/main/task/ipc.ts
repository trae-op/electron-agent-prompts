import { cacheTask } from "../@shared/cache-responses.js";
import {
  ipcMainHandle,
  ipcMainOn,
  ipcWebContentsSend,
} from "../@shared/utils.js";
import { getTask, loadMarkdownContentFromTaskUrl } from "./service.js";
import { openWindow } from "./window.js";
import { getStore, setStore } from "../@shared/store.js";
import { getWindow } from "../@shared/control-window/receive.js";
import {
  getMarkdownContentByTaskId,
  saveMarkdownContent,
} from "./utils/storage.js";
import { createMarkdownFile, saveFileToStoredFolders } from "./utils/files.js";
import { getConnectionInstructionByTaskId } from "./utils/connection-storage.js";
import { connectionInstruction } from "./utils/connection.js";
import { getFoldersContentByTaskId } from "./utils/folders.js";

export function registerIpc({
  updateTask,
  initMenu,
}: {
  initMenu?: (currentWindow: Electron.BrowserWindow) => void;
  updateTask: (payload: TEventSendInvoke["updateTask"]) => Promise<
    | {
        task: TTask;
        fileBlob: Blob | undefined;
        fileName: string | undefined;
      }
    | undefined
  >;
}): void {
  ipcMainOn("windowTask", (_, { id }) => {
    const window = openWindow({
      hash: `window:task/${id}`,
    });

    if (!window) {
      return;
    }

    initMenu?.(window);

    window.webContents.on("found-in-page", (_, result) => {
      window.webContents.send("search-result", {
        activeMatchOrdinal: result.activeMatchOrdinal,
        matches: result.matches,
      });
    });
  });

  ipcMainOn(
    "task",
    async (
      event: Electron.IpcMainEvent,
      payload: TEventPayloadSend["task"] | undefined,
    ) => {
      if (payload === undefined) {
        return;
      }

      const taskId = payload.taskId;

      const taskFromCache = cacheTask(taskId);
      let markdownContents = getMarkdownContentByTaskId(taskId);

      if (taskFromCache !== undefined) {
        event.reply("task", {
          task: taskFromCache,
          contents: markdownContents ?? [],
        });
      }

      const task = await getTask(taskId);

      if (
        (markdownContents === undefined || markdownContents.length === 0) &&
        task?.url
      ) {
        markdownContents = await loadMarkdownContentFromTaskUrl(task);
      }

      if (task !== undefined) {
        event.reply("task", {
          task,
          contents: markdownContents ?? [],
        });
      }
    },
  );

  ipcMainOn("findInPage", (event, payload) => {
    if (payload === undefined) {
      return;
    }

    const text = payload.text.trim();

    if (text === "") {
      return;
    }

    event.sender.findInPage(text, payload.options || { findNext: true });
  });

  ipcMainOn("stopFindInPage", (event) => {
    event.sender.stopFindInPage("clearSelection");
  });

  ipcMainHandle("markdownContent", async (payload) => {
    if (payload === undefined || payload.contents.length === 0) {
      return undefined;
    }

    saveMarkdownContent(payload);
    const markdownContents = getMarkdownContentByTaskId(payload.taskId);

    if (markdownContents === undefined || markdownContents.length === 0) {
      return undefined;
    }

    const markdownFilePath = await createMarkdownFile(
      payload.taskId,
      markdownContents,
    );

    setStore("uploadedFilePath", markdownFilePath);

    const cachedTask = cacheTask(payload.taskId);
    const task = cachedTask ?? (await getTask(payload.taskId));

    if (task === undefined) {
      return undefined;
    }

    const taskWindow = getWindow<TWindows["task"]>(`window:task/${task.id}`);
    const mainWindow = getWindow<TWindows["main"]>("window:main");
    const result = await updateTask({
      id: task.id,
      name: task.name,
      projectId: task.projectId,
      fileId: task.fileId,
      url: task.url,
    });

    if (result === undefined) {
      return undefined;
    }

    if (result.task === undefined) {
      return undefined;
    }

    if (result.fileBlob !== undefined) {
      const projectIdStore = getStore<string, string>("projectId");
      const connectionInstructionPayload = getConnectionInstructionByTaskId(
        String(result.task.id),
        projectIdStore,
      );
      const normalizedIde = connectionInstructionPayload?.ide?.trim();
      const isSkills = connectionInstructionPayload?.isSkills === true;

      if (!isSkills) {
        await saveFileToStoredFolders({
          file: result.fileBlob,
          fileName: task.name,
          taskId: String(result.task.id),
        });
      }

      if (normalizedIde !== undefined && normalizedIde.length > 0) {
        await connectionInstruction({
          fileBlob: result.fileBlob,
          ide: normalizedIde,
          isSkills,
          isSettings: connectionInstructionPayload?.isSettings,
          taskName: task.name,
          folderPaths: isSkills
            ? (getFoldersContentByTaskId(
                String(result.task.id),
                projectIdStore,
              ) ?? [])
            : undefined,
        });
      }
    }

    if (taskWindow !== undefined && mainWindow !== undefined) {
      const projectIdStore = getStore<string, string>("projectId");
      const connectionInstructionPayload = getConnectionInstructionByTaskId(
        String(result.task.id),
        projectIdStore,
      );

      ipcWebContentsSend("updateTask", mainWindow.webContents, {
        task: {
          ...result.task,
          ide: connectionInstructionPayload?.ide,
          isSkills: connectionInstructionPayload?.isSkills,
          isSettings: connectionInstructionPayload?.isSettings,
        },
      });
      taskWindow.hide();
    }

    return undefined;
  });
}
