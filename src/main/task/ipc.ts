import { cacheTask } from "../@shared/cache-responses.js";
import { ipcMainHandle, ipcMainOn } from "../@shared/utils.js";
import { getTask } from "./service.js";
import { openWindow } from "./window.js";
import {
  getStore,
  setElectronStorage,
  getElectronStorage,
} from "../@shared/store.js";

function saveMarkdownContent(payload: {
  taskId: string;
  contents: TMarkdownContent[];
}) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent") ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  setElectronStorage("markdownContent", {
    ...markdownContent,
    [projectIdStore]: {
      ...projectMarkdown,
      [payload.taskId]: payload.contents,
    },
  });
}

function getMarkdownContentByTaskId(taskId: string) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent") ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  return projectMarkdown[taskId];
}

export function registerIpc(): void {
  ipcMainOn("windowTask", (_, { id }) => {
    const window = openWindow({
      hash: `window:task/${id}`,
    });

    window.webContents.toggleDevTools();
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
      const markdownContents = getMarkdownContentByTaskId(payload.taskId);

      if (taskFromCache !== undefined) {
        event.reply("task", {
          task: taskFromCache,
          contents: markdownContents ?? [],
        });
      }

      const task = await getTask(payload.taskId);
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

    return undefined;
  });
}
