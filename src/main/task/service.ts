import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { buildTaskEndpoint } from "../@shared/utils.js";
import { buildMarkdownDocument } from "./utils.js";
import {
  getElectronStorage,
  getStore,
  setElectronStorage,
} from "../@shared/store.js";

export async function getTask<R extends TTask>(
  taskId: string
): Promise<R | undefined> {
  const response = await get<R>(buildTaskEndpoint(taskId), {
    isCache: true,
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getTask",
      body: response.error.message,
    });
  }

  return response.data;
}

export async function createMarkdownFile(
  taskId: string,
  contents: TMarkdownContent[]
): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "markdown-"));
  const filePath = join(directory, `task-${taskId}.md`);
  const markdown = buildMarkdownDocument(contents);

  await writeFile(filePath, markdown, "utf8");

  return filePath;
}

export function saveMarkdownContent(payload: {
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

export function getMarkdownContentByTaskId(taskId: string) {
  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent") ?? {};
  const projectMarkdown = markdownContent[projectIdStore] ?? {};

  return projectMarkdown[taskId];
}
