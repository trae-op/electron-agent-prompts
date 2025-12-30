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

export function registerIpc({
  deleteFoldersContent,
  deleteConnectionInstruction,
}: {
  deleteFoldersContent: (
    taskId: string,
    projectId?: string | undefined
  ) => void;
  deleteConnectionInstruction: (
    taskId: string,
    projectId?: string | undefined
  ) => void;
}): void {
  ipcMainHandle("deleteTask", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    deleteMarkdownContent(String(payload.id));
    const result = await deleteTask(payload);
    const projectId = getStore<string, string>("projectId");

    if (result) {
      deleteFoldersContent(String(payload.id), projectId);
      deleteConnectionInstruction(String(payload.id), projectId);
    }

    return result;
  });
}
