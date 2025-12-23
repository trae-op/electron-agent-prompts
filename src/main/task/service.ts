import { randomUUID } from "node:crypto";
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

export async function loadMarkdownContentFromTaskUrl(
  task: TTask
): Promise<TMarkdownContent[] | undefined> {
  if (!task.url) {
    return undefined;
  }

  const response = await get<string>(task.url, {
    responseType: "text",
    isCache: false,
  });

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by loadMarkdownContentFromTaskUrl",
      body: response.error.message,
    });
    return undefined;
  }

  if (typeof response.data !== "string") {
    return undefined;
  }

  const parsedContents = parseMarkdownFileContent(response.data);

  if (parsedContents.length === 0) {
    return undefined;
  }

  saveMarkdownContent({
    taskId: String(task.id),
    contents: parsedContents,
  });

  return parsedContents;
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

function parseMarkdownFileContent(markdown: string): TMarkdownContent[] {
  const blocks: TMarkdownContent[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let insideCode = false;

  const pushBlock = (content: string, explicitType?: TTypesMarkdownContent) => {
    const normalizedContent =
      explicitType === "code"
        ? content.replace(/^\n+|\n+$/g, "")
        : content.trim();

    if (!normalizedContent) {
      return;
    }

    const type = explicitType ?? detectMarkdownContentType(normalizedContent);

    blocks.push({
      id: randomUUID(),
      type,
      content: normalizedContent,
      position: blocks.length + 1,
    });
  };

  const flushTextBuffer = () => {
    if (textBuffer.length === 0) {
      return;
    }

    const content = textBuffer.join("\n");
    pushBlock(content);
    textBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (insideCode) {
      if (trimmed.startsWith("```")) {
        pushBlock(codeBuffer.join("\n"), "code");
        codeBuffer = [];
        insideCode = false;
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushTextBuffer();
      insideCode = true;
      codeBuffer = [];
      continue;
    }

    if (trimmed === "") {
      flushTextBuffer();
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushTextBuffer();
      pushBlock(trimmed, "title");
      continue;
    }

    textBuffer.push(line);
  }

  if (insideCode) {
    pushBlock(codeBuffer.join("\n"), "code");
  } else {
    flushTextBuffer();
  }

  return blocks;
}

function detectMarkdownContentType(content: string): TTypesMarkdownContent {
  const normalized = content.trim();

  if (/^#{1,6}\s+/.test(normalized)) {
    return "title";
  }

  const lines = normalized.split(/\r?\n/).map((line) => line.trim());
  const isList =
    lines.length > 0 && lines.every((line) => /^(-|\*|\d+\.)\s+/.test(line));

  if (isList) {
    return "list";
  }

  const newlineCount = lines.length - 1;
  const codeSignals = [
    ";",
    "{",
    "}",
    "=>",
    "function",
    "const ",
    "let ",
    "var ",
  ];
  const hasCodeSignals = codeSignals.some((signal) =>
    normalized.includes(signal)
  );

  if (newlineCount > 0 && hasCodeSignals) {
    return "code";
  }

  return "text";
}
