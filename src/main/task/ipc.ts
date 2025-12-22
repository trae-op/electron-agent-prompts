import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cacheTask } from "../@shared/cache-responses.js";
import { logger } from "../@shared/logger.js";
import { getDocsPath } from "../@shared/path-resolver.js";
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

function formatMarkdownContent(content: TMarkdownContent): string {
  if (content.type === "title") {
    return normalizeHeadingContent(content.content);
  }

  if (content.type === "code") {
    return ["```", content.content, "```"].join("\n");
  }

  if (content.type === "list") {
    return normalizeListContent(content.content);
  }

  return content.content;
}

function normalizeHeadingContent(value: string): string {
  const trimmedValue = value.trim();
  const match = trimmedValue.match(/^(#+)\s*(.*)$/);

  if (!match) {
    return `## ${trimmedValue}`;
  }

  const hashes = match[1].slice(0, 6);
  const text = match[2].trim();

  return `${hashes} ${text}`.trim();
}

function normalizeListContent(value: string): string {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*+]\s*/, ""));

  return lines.map((line) => `- ${line}`).join("\n");
}

function buildMarkdownDocument(contents: TMarkdownContent[]): string {
  const sortedContents = [...contents].sort(
    (firstItem, secondItem) => firstItem.position - secondItem.position
  );

  return sortedContents.map(formatMarkdownContent).join("\n\n");
}

async function writeMarkdownToDocs(
  taskId: string,
  contents: TMarkdownContent[] | undefined
): Promise<void> {
  const projectIdStore = getStore<string, string>("projectId");

  if (
    projectIdStore === undefined ||
    contents === undefined ||
    contents.length === 0
  ) {
    return;
  }

  const docsPath = getDocsPath();
  const projectDocsPath = path.join(docsPath, `project-${projectIdStore}`);
  const filePath = path.join(projectDocsPath, `task-${taskId}.md`);

  try {
    await mkdir(projectDocsPath, { recursive: true });
    await writeFile(filePath, buildMarkdownDocument(contents), "utf8");
  } catch (error) {
    logger.error(
      `Failed to write markdown file for task ${taskId} in project ${projectIdStore}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
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
    const markdownContents = getMarkdownContentByTaskId(payload.taskId);
    await writeMarkdownToDocs(payload.taskId, markdownContents);

    return undefined;
  });
}
