import {
  getElectronStorage,
  getStore,
  setElectronStorage,
} from "../../@shared/store.js";

const MARKDOWN_STORAGE_KEY = "markdownContent";

export function saveMarkdownContent(payload: {
  taskId: string;
  contents: TMarkdownContent[];
}) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage(MARKDOWN_STORAGE_KEY) ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  setElectronStorage(MARKDOWN_STORAGE_KEY, {
    ...markdownContent,
    [projectIdStore]: {
      ...projectMarkdown,
      [payload.taskId]: payload.contents,
    },
  });
}

export function getMarkdownContentByTaskId(taskId: string) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage(MARKDOWN_STORAGE_KEY) ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  return projectMarkdown[taskId];
}

export function getMarkdownContentByProjectId(projectId?: string) {
  if (projectId === undefined) {
    return;
  }

  const markdownContent = getElectronStorage(MARKDOWN_STORAGE_KEY) ?? {};

  return markdownContent[projectId] ?? {};
}
