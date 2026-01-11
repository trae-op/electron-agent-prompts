import { randomUUID } from "node:crypto";
import { showErrorMessages } from "../../@shared/services/error-messages.js";

export function buildMarkdownDocument(contents: TMarkdownContent[]): string {
  return [...contents]
    .sort((a, b) => a.position - b.position)
    .map((item) => {
      if (item.type === "code" || item.type === "architecture") {
        const normalizedContent = item.content.replace(/\s+$/, "");
        const fence = item.type === "architecture" ? "```architecture" : "```";

        return [fence, normalizedContent, "```"].join("\n");
      }

      return item.content;
    })
    .join("\n\n");
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

export function parseMarkdownFileContent(markdown: string): TMarkdownContent[] {
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

  if (isAgentSkillsFrontmatter(normalized)) {
    return "agent-skills";
  }

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

function isAgentSkillsFrontmatter(content: string): boolean {
  const lines = content.split(/\r?\n/);

  if (lines.length < 4) {
    return false;
  }

  if (lines[0].trim() !== "---") {
    return false;
  }

  if (lines[lines.length - 1].trim() !== "---") {
    return false;
  }

  let hasName = false;
  let hasDescription = false;

  for (const line of lines.slice(1, -1)) {
    const trimmed = line.trim().toLowerCase();

    if (trimmed.startsWith("name:")) {
      hasName = true;
    }

    if (trimmed.startsWith("description:")) {
      hasDescription = true;
    }
  }

  return hasName && hasDescription;
}
