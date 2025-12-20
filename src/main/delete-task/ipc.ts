import {
  getStore,
  setElectronStorage,
  getElectronStorage,
} from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { deleteTask } from "./service.js";

function deleteMarkdownContent(taskId: string) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent") ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  if (projectMarkdown[taskId] === undefined) {
    return;
  }

  const { [taskId]: _, ...restTasks } = projectMarkdown;

  setElectronStorage("markdownContent", {
    ...markdownContent,
    [projectIdStore]: restTasks,
  });
}

export function registerIpc(): void {
  ipcMainHandle("deleteTask", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    deleteMarkdownContent(String(payload.id));

    return deleteTask(payload);
  });
}
