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

  let projects = markdownContent;

  delete projects[projectId];

  setElectronStorage("markdownContent", projects);
}

export function registerIpc(): void {
  ipcMainHandle("deleteProject", async (payload) => {
    if (payload === undefined) {
      return false;
    }

    deleteMarkdownContents(payload.id);

    const markdownContent = getElectronStorage("markdownContent");
    console.log("deleteProject Stored markdown content:", markdownContent);

    return deleteProject(payload);
  });
}
