import axios from "axios";
import { randomUUID } from "node:crypto";
import { access, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join, dirname, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import { get } from "../@shared/services/rest-api/service.js";
import { showErrorMessages } from "../@shared/services/error-messages.js";
import { buildTaskEndpoint } from "../@shared/utils.js";
import { buildMarkdownDocument } from "./utils.js";
import {
  getElectronStorage,
  getStore,
  setElectronStorage,
  setStore,
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

export async function downloadByUrl(url: string): Promise<Blob | undefined> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });

    const headerContentType = response.headers["content-type"];
    const contentType = Array.isArray(headerContentType)
      ? headerContentType[0]
      : headerContentType ?? "application/octet-stream";

    return new Blob([response.data], {
      type: contentType,
    });
  } catch (error) {
    showErrorMessages({
      title: "Error downloading file",
      body: error instanceof Error ? error.message : String(error),
    });

    return undefined;
  }
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

export function getMarkdownContentByProjectId(projectId?: string) {
  if (projectId === undefined) {
    return;
  }

  const markdownContent = getElectronStorage("markdownContent") ?? {};

  return markdownContent[projectId] ?? {};
}

const FOLDERS_STORAGE_KEY = "foldersContentFiles";

const CONNECTION_INSTRUCTION_STORAGE_KEY = "connectionInstructionFiles";

type TConnectionInstructionEntry = {
  ide?: string;
};

function normalizeFolders(folders: string[]): string[] {
  return Array.from(
    new Set(
      folders
        .map((folder) => folder.trim())
        .filter((folder) => folder.length > 0)
    )
  );
}

export function saveFoldersContent(payload: {
  projectId: string;
  taskId: string;
  folders: string[];
}) {
  const normalizedFolders = normalizeFolders(payload.folders);
  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[payload.projectId] ?? {};

  if (normalizedFolders.length === 0) {
    delete projectFolders[payload.taskId];

    if (Object.keys(projectFolders).length === 0) {
      const { [payload.projectId]: _, ...restProjects } = storage;
      setElectronStorage(FOLDERS_STORAGE_KEY, restProjects);
      return;
    }

    setElectronStorage(FOLDERS_STORAGE_KEY, {
      ...storage,
      [payload.projectId]: projectFolders,
    });

    return;
  }

  setElectronStorage(FOLDERS_STORAGE_KEY, {
    ...storage,
    [payload.projectId]: {
      ...projectFolders,
      [payload.taskId]: normalizedFolders,
    },
  });
}

export function deleteFoldersContent(taskId: string, projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey];

  if (projectFolders === undefined || projectFolders[taskId] === undefined) {
    return;
  }

  const { [taskId]: _, ...restTasks } = projectFolders;

  if (Object.keys(restTasks).length === 0) {
    const { [projectKey]: __, ...restProjects } = storage;
    setElectronStorage(FOLDERS_STORAGE_KEY, restProjects);
    return;
  }

  setElectronStorage(FOLDERS_STORAGE_KEY, {
    ...storage,
    [projectKey]: restTasks,
  });
}

export function deleteProjectFoldersContent(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey];

  if (projectFolders === undefined) {
    return;
  }

  delete storage[projectKey];

  setElectronStorage(FOLDERS_STORAGE_KEY, storage);
}

export function getFoldersContentByTaskId(taskId: string, projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey] ?? {};

  return projectFolders[taskId];
}

export function getFoldersContentByProjectId(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(FOLDERS_STORAGE_KEY) ?? {};
  const projectFolders = storage[projectKey] ?? {};

  return projectFolders;
}

export function saveConnectionInstruction(payload: {
  projectId: string;
  taskId: string;
  ide?: string;
}) {
  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[payload.projectId] ?? {};

  const normalizedIde = payload.ide?.trim();

  if (normalizedIde === undefined || normalizedIde.length === 0) {
    if (projectInstructions[payload.taskId] === undefined) {
      return;
    }

    delete projectInstructions[payload.taskId];

    if (Object.keys(projectInstructions).length === 0) {
      const { [payload.projectId]: _, ...restProjects } = storage;
      setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, restProjects);
      return;
    }

    setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
      ...storage,
      [payload.projectId]: projectInstructions,
    });

    return;
  }

  setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
    ...storage,
    [payload.projectId]: {
      ...projectInstructions,
      [payload.taskId]: {
        ide: normalizedIde,
      },
    },
  });
}

export function deleteConnectionInstruction(
  taskId: string,
  projectId?: string
) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[projectKey];

  if (
    projectInstructions === undefined ||
    projectInstructions[taskId] === undefined
  ) {
    return;
  }

  const { [taskId]: _, ...restTasks } = projectInstructions;

  if (Object.keys(restTasks).length === 0) {
    const { [projectKey]: __, ...restProjects } = storage;
    setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, restProjects);
    return;
  }

  setElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY, {
    ...storage,
    [projectKey]: restTasks,
  });
}

export function getConnectionInstructionByTaskId(
  taskId: string,
  projectId?: string
): TConnectionInstructionEntry | undefined {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};
  const projectInstructions = storage[projectKey] ?? {};

  return projectInstructions[taskId];
}

export function getConnectionInstructionByProjectId(projectId?: string) {
  const projectKey = projectId ?? getStore<string, string>("projectId");

  if (projectKey === undefined) {
    return;
  }

  const storage = getElectronStorage(CONNECTION_INSTRUCTION_STORAGE_KEY) ?? {};

  return storage[projectKey];
}

export async function connectionInstruction(payload: {
  fileBlob?: Blob;
  ide?: string;
}): Promise<void> {
  const { fileBlob, ide } = payload;

  if (fileBlob === undefined) {
    return;
  }

  const savedFilePaths = getStore<string[], string>("lastSavedFilePaths") ?? [];

  if (savedFilePaths.length === 0) {
    return;
  }

  switch (ide ?? "vs-code") {
    case "vs-code": {
      await applyVsCodeConnectionInstruction({
        fileBlob,
        savedFilePaths,
      });
      break;
    }
    default:
      break;
  }
}

async function findVsCodeSettingsPath(
  startPath: string
): Promise<string | undefined> {
  let currentDir = dirname(startPath);

  while (true) {
    const candidate = join(currentDir, ".vscode", "settings.json");

    try {
      await access(candidate);
      return candidate;
    } catch {
      // continue searching upwards
    }

    const parentDir = dirname(currentDir);

    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
}

async function applyVsCodeConnectionInstruction({
  fileBlob,
  savedFilePaths,
}: {
  fileBlob: Blob;
  savedFilePaths: string[];
}) {
  try {
    if (fileBlob.size === 0) {
      return;
    }

    const settingsPaths = await Promise.all(
      savedFilePaths.map((path) => findVsCodeSettingsPath(path))
    );
    const uniqueSettingsPaths = Array.from(
      new Set(
        settingsPaths.filter((path): path is string => path !== undefined)
      )
    );

    if (uniqueSettingsPaths.length === 0) {
      return;
    }

    for (const settingsPath of uniqueSettingsPaths) {
      const fileContent = await readFile(settingsPath, "utf8");

      let parsed: Record<string, unknown>;

      try {
        parsed = JSON.parse(fileContent) as Record<string, unknown>;
      } catch (error) {
        showErrorMessages({
          title: "Error parsing connection instruction file",
          body: error instanceof Error ? error.message : String(error),
        });

        continue;
      }

      const instructions = normalizeInstructionEntries(
        parsed["github.copilot.chat.codeGeneration.instructions"]
      );

      const dedupedInstructions: TInstructionEntry[] = [];
      const existingFiles = new Set<string>();

      for (const entry of instructions) {
        const normalized = normalizePathSeparator(entry.file);

        if (existingFiles.has(normalized)) {
          continue;
        }

        existingFiles.add(normalized);
        dedupedInstructions.push(entry);
      }

      const projectRoot = resolve(settingsPath, "..", "..");
      const projectFiles = savedFilePaths
        .filter((savedPath) => isPathInsideRoot(savedPath, projectRoot))
        .map(
          (savedPath) =>
            `./${normalizePathSeparator(relative(projectRoot, savedPath))}`
        );

      for (const projectFile of projectFiles) {
        const normalizedProjectFile = normalizePathSeparator(projectFile);
        const targetFile = normalizedProjectFile.endsWith(".md")
          ? normalizedProjectFile
          : `${normalizedProjectFile}.md`;

        if (!existingFiles.has(targetFile)) {
          dedupedInstructions.push({ file: targetFile });
          existingFiles.add(targetFile);
        }
      }

      parsed["github.copilot.chat.codeGeneration.instructions"] =
        dedupedInstructions;

      await writeFile(settingsPath, JSON.stringify(parsed, null, 2), "utf8");
    }
  } catch (error) {
    showErrorMessages({
      title: "Error applying connection instruction",
      body: error instanceof Error ? error.message : String(error),
    });
  }
}

type TInstructionEntry = {
  file: string;
};

function normalizePathSeparator(pathStr: string): string {
  return pathStr.replace(/\\/g, "/");
}

function isPathInsideRoot(targetPath: string, rootPath: string): boolean {
  const normalizedRoot = normalizePathSeparator(resolve(rootPath));
  const normalizedTarget = normalizePathSeparator(resolve(targetPath));
  const rootWithSlash = normalizedRoot.endsWith("/")
    ? normalizedRoot
    : `${normalizedRoot}/`;

  return normalizedTarget.toLowerCase().startsWith(rootWithSlash.toLowerCase());
}

function normalizeInstructionEntries(value: unknown): TInstructionEntry[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return { file: item };
        }

        if (
          typeof item === "object" &&
          item !== null &&
          typeof (item as { file?: unknown }).file === "string"
        ) {
          return { file: (item as { file: string }).file };
        }

        return undefined;
      })
      .filter((entry): entry is TInstructionEntry => entry !== undefined);
  }

  if (typeof value === "string") {
    return [{ file: value }];
  }

  return [];
}

export async function buildMarkdownContentsFromBlob(
  fileBlob: Blob
): Promise<TMarkdownContent[]> {
  try {
    const markdownText = await fileBlob.text();
    return parseMarkdownFileContent(markdownText);
  } catch (error) {
    showErrorMessages({
      title: "Error parsing markdown file",
      body: error instanceof Error ? error.message : String(error),
    });

    return [];
  }
}

export async function saveFileToStoredFolders(payload: {
  file: Blob;
  fileName: string;
  taskId: string;
}): Promise<void> {
  setStore("lastSavedFilePaths", []);

  const projectIdStore = getStore<string, string>("projectId");

  if (projectIdStore === undefined) {
    return;
  }

  const folders = getFoldersContentByTaskId(payload.taskId, projectIdStore);

  if (folders === undefined) {
    return;
  }

  if (folders === undefined || folders.length === 0) {
    return;
  }

  const normalizedFolders = normalizeFolders(folders);

  if (normalizedFolders.length === 0) {
    return;
  }

  const fileBuffer = Buffer.from(await payload.file.arrayBuffer());

  const destinations = normalizedFolders.map((folderPath) =>
    join(folderPath, payload.fileName)
  );

  const results = await Promise.allSettled(
    destinations.map(async (destination) => {
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, fileBuffer);
    })
  );

  setStore("lastSavedFilePaths", destinations);

  const failed = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected"
  );

  if (failed !== undefined) {
    showErrorMessages({
      title: "Error saving file to folders",
      body:
        failed.reason instanceof Error
          ? failed.reason.message
          : String(failed.reason),
    });
  }
}

function parseMarkdownFileContent(markdown: string): TMarkdownContent[] {
  const blocks: TMarkdownContent[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let insideCode = false;
  let codeBlockType: TTypesMarkdownContent | undefined;

  const pushBlock = (content: string, explicitType?: TTypesMarkdownContent) => {
    const trimmedContent = trimEmptyBoundaryLines(content);

    if (!trimmedContent) {
      return;
    }

    const type = explicitType ?? detectMarkdownContentType(trimmedContent);
    const storedContent =
      type === "code" || type === "list"
        ? trimmedContent
        : trimmedContent.trim();

    blocks.push({
      id: randomUUID(),
      type,
      content: storedContent,
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
        pushBlock(codeBuffer.join("\n"), codeBlockType ?? "code");
        codeBuffer = [];
        insideCode = false;
        codeBlockType = undefined;
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushTextBuffer();
      insideCode = true;
      codeBuffer = [];
      codeBlockType = parseFenceType(trimmed);
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
    pushBlock(codeBuffer.join("\n"), codeBlockType ?? "code");
  } else {
    flushTextBuffer();
  }

  return blocks;
}

function parseFenceType(line: string): TTypesMarkdownContent {
  const language = line.slice(3).trim().toLowerCase();

  if (language === "architecture") {
    return "architecture";
  }

  return "code";
}

function trimEmptyBoundaryLines(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  return lines.join("\n");
}

function detectMarkdownContentType(content: string): TTypesMarkdownContent {
  const normalized = content.trim();

  if (/^#{1,6}\s+/.test(normalized)) {
    return "title";
  }

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const hasArchitectureSymbols =
    normalized.includes("├──") ||
    normalized.includes("└──") ||
    normalized.includes("│");

  if (hasArchitectureSymbols) {
    return "architecture";
  }
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
