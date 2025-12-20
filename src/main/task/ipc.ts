import { cacheTask } from "../@shared/cache-responses.js";
import { ipcMainHandle, ipcMainOn } from "../@shared/utils.js";
import { getTask } from "./service.js";
import { openWindow } from "./window.js";
import {
  getStore,
  setElectronStorage,
  getElectronStorage,
} from "../@shared/store.js";

function addMarkdownContent(contents: TMarkdownContent[]) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent");
  if (markdownContent === undefined) {
    return;
  }

  const projectMarkdown = markdownContent[projectIdStore];
  if (projectMarkdown === undefined) {
    return;
  }

  setElectronStorage("markdownContent", {
    ...markdownContent,
    [projectIdStore]: contents,
  });
}

export function registerIpc(): void {
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

      if (taskFromCache !== undefined) {
        event.reply("task", {
          task: taskFromCache,
        });
      }

      const task = await getTask(payload.taskId);
      if (task !== undefined) {
        event.reply("task", {
          task,
        });
      }
    }
  );

  ipcMainHandle("markdownContent", async (payload) => {
    if (payload === undefined || payload.contents.length === 0) {
      return undefined;
    }

    addMarkdownContent(payload.contents);
    const markdownContent = getElectronStorage("markdownContent");
    console.log("Stored markdown content:", markdownContent);

    return undefined;
  });
}
