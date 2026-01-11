import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { getStore, setStore } from "../../@shared/store.js";
import { showErrorMessages } from "../../@shared/services/error-messages.js";
import { buildMarkdownDocument } from "./markdown.js";
import { getFoldersContentByTaskId, normalizeFolders } from "./folders.js";

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

  if (folders === undefined || folders.length === 0) {
    return;
  }

  const normalizedFolders = normalizeFolders(folders);

  if (normalizedFolders.length === 0) {
    return;
  }

  const fileName = ensureMarkdownExtension(payload.fileName);

  const fileBuffer = Buffer.from(await payload.file.arrayBuffer());

  const destinations = normalizedFolders.map((folderPath) =>
    join(folderPath, fileName)
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
    showFileSaveError(failed);
  }
}

function ensureMarkdownExtension(fileName: string): string {
  const trimmed = fileName.trim();
  const normalized = trimmed.length > 0 ? trimmed : "file";

  return normalized.toLowerCase().endsWith(".md")
    ? normalized
    : `${normalized}.md`;
}

function showFileSaveError(result: PromiseRejectedResult) {
  const message =
    result.reason instanceof Error
      ? result.reason.message
      : String(result.reason);

  showSaveErrorMessage(message);
}

function showSaveErrorMessage(message: string) {
  showErrorMessages({
    title: "Error saving file to folders",
    body: message,
  });
}
