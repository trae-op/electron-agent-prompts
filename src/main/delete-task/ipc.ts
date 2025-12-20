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

  const markdownContent = getElectronStorage("markdownContent");
  if (markdownContent === undefined) {
    return;
  }

  const projectMarkdown = markdownContent[projectIdStore];
  if (projectMarkdown === undefined) {
    return;
  }

  const found = projectMarkdown.find((item) => item.id === taskId);
  if (found === undefined) {
    return;
  }

  setElectronStorage("markdownContent", {
    [projectIdStore]: projectMarkdown.filter((item) => item.id !== taskId),
  });
}

export function registerIpc(): void {
  ipcMainHandle("deleteTask", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    deleteMarkdownContent(String(payload.id));

    const markdownContent = getElectronStorage("markdownContent");
    console.log("deleteTask Stored markdown content:", markdownContent);

    return deleteTask(payload);
  });
}
