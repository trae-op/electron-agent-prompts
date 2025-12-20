import { setElectronStorage, getElectronStorage } from "../@shared/store.js";
import { ipcMainHandle } from "../@shared/utils.js";
import { deleteProject } from "./service.js";

function deleteMarkdownContents(projectId: string) {
  const markdownContent = getElectronStorage("markdownContent");
  if (markdownContent === undefined) {
    return;
  }

  const projectMarkdown = markdownContent[projectId];
  if (projectMarkdown === undefined) {
    return;
  }

  const { [projectId]: _, ...rest } = markdownContent;

  setElectronStorage("markdownContent", rest);
}

export function registerIpc(): void {
  ipcMainHandle("deleteProject", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    deleteMarkdownContents(payload.id);

    return deleteProject(payload);
  });
}
