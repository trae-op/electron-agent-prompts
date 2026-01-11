import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { getStore } from "../../@shared/store.js";
import { showErrorMessages } from "../../@shared/services/error-messages.js";

export async function connectionInstruction(payload: {
  fileBlob?: Blob;
  ide?: string;
  isSkills?: boolean;
  taskName?: string;
  folderPaths?: string[];
}): Promise<void> {
  const { fileBlob, ide, isSkills, taskName, folderPaths } = payload;

  if (fileBlob === undefined) {
    return;
  }

  const savedFilePaths =
    folderPaths !== undefined && folderPaths.length > 0
      ? folderPaths
      : getStore<string[], string>("lastSavedFilePaths") ?? [];

  if (savedFilePaths.length === 0) {
    return;
  }

  switch (ide) {
    case "vs-code": {
      if (isSkills === true) {
        await applyAgentSkillsInstruction({
          fileBlob,
          savedFilePaths,
          taskName,
        });
      } else {
        await applyVsCodeConnectionInstruction({
          fileBlob,
          savedFilePaths,
        });
      }
      break;
    }
    default:
      break;
  }
}

function sanitizeSkillsFolderName(taskName: string): string {
  const trimmed = taskName.trim();
  const fallback = trimmed.length > 0 ? trimmed : "task";

  return fallback
    .replace(/[\\/]/g, "-")
    .replace(/[<>:\":|?*]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

async function applyAgentSkillsInstruction({
  fileBlob,
  savedFilePaths,
  taskName,
}: {
  fileBlob: Blob;
  savedFilePaths: string[];
  taskName?: string;
}) {
  try {
    if (fileBlob.size === 0) {
      return;
    }

    const resolvedTaskName = sanitizeSkillsFolderName(taskName ?? "task");
    const markdown = await fileBlob.text();

    if (markdown.trim().length === 0) {
      return;
    }

    const gitRoots = await Promise.all(
      savedFilePaths.map((path) => findGitRoot(path))
    );
    const uniqueGitRoots = Array.from(
      new Set(gitRoots.filter((path): path is string => path !== undefined))
    );

    const projectRoots =
      uniqueGitRoots.length > 0
        ? uniqueGitRoots
        : Array.from(
            new Set(
              (
                await Promise.all(
                  savedFilePaths.map((path) => findVsCodeSettingsPath(path))
                )
              )
                .filter((path): path is string => path !== undefined)
                .map((settingsPath) => resolve(settingsPath, "..", ".."))
            )
          );

    if (projectRoots.length === 0) {
      return;
    }

    for (const projectRoot of projectRoots) {
      const skillsDir = join(
        projectRoot,
        ".github",
        "skills",
        resolvedTaskName
      );
      await mkdir(skillsDir, { recursive: true });

      const skillFilePath = join(skillsDir, "SKILL.md");
      await writeFile(skillFilePath, markdown, "utf8");
    }
  } catch (error) {
    showErrorMessages({
      title: "Error applying agent skills instruction",
      body: error instanceof Error ? error.message : String(error),
    });
  }
}

async function findVsCodeSettingsPath(
  startPath: string
): Promise<string | undefined> {
  let currentDir = await resolveStartDir(startPath);

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

async function findGitRoot(startPath: string): Promise<string | undefined> {
  let currentDir = await resolveStartDir(startPath);

  while (true) {
    const candidate = join(currentDir, ".git");

    try {
      await access(candidate);
      return currentDir;
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

async function resolveStartDir(startPath: string): Promise<string> {
  const resolved = resolve(startPath);

  try {
    const stats = await stat(resolved);
    if (stats.isDirectory()) {
      return resolved;
    }
  } catch {
    // ignore
  }

  return dirname(resolved);
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
