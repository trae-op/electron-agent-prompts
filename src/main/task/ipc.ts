import { cacheTask } from "../@shared/cache-responses.js";
import {
  ipcMainHandle,
  ipcMainOn,
  ipcWebContentsSend,
} from "../@shared/utils.js";
import {
  createMarkdownFile,
  getMarkdownContentByTaskId,
  getTask,
  loadMarkdownContentFromTaskUrl,
  saveMarkdownContent,
} from "./service.js";
import { openWindow } from "./window.js";
import { setStore } from "../@shared/store.js";
import { getWindow } from "../@shared/control-window/receive.js";

export function registerIpc({
  updateTask,
}: {
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

    // window.webContents.toggleDevTools();
  });

  ipcMainOn(
    "task",
    async (
      event: Electron.IpcMainEvent,
      payload: TEventPayloadSend["task"] | undefined
    ) => {
      if (payload === undefined) {
        return;
      }

      const taskFromCache = cacheTask(payload.taskId);
      let markdownContents = getMarkdownContentByTaskId(payload.taskId);

      if (taskFromCache !== undefined) {
        event.reply("task", {
          task: taskFromCache,
          contents: markdownContents ?? [],
        });
      }

      const task = await getTask(payload.taskId);

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
    }
  );

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
      markdownContents
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

    if (
      result !== undefined &&
      taskWindow !== undefined &&
      mainWindow !== undefined
    ) {
      ipcWebContentsSend("updateTask", mainWindow.webContents, {
        task: result.task,
      });
      taskWindow.hide();
    }

    return undefined;
  });
}
