import { createId } from "@utils/generation";

const ARCHITECTURE_LANGUAGES = new Set([
  "architecture",
  "arch",
  "mermaid",
  "plantuml",
  "tree",
]);

type TContentDraft = {
  type: TTypesMarkdownContent;
  content: string;
};

export function convertMarkdownToContents(
  markdown: string
): TMarkdownContent[] {
  const drafts: TContentDraft[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let insideCode = false;
  let codeBlockType: TTypesMarkdownContent = "code";

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;

    const text = paragraphBuffer.join("\n").trim();

    if (text.length > 0) {
      drafts.push({ type: "text", content: text });
    }

    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) return;

    const content = listBuffer.join("\n");

    if (content.trim().length > 0) {
      drafts.push({ type: "list", content });
    }

    listBuffer = [];
  };

  const flushCode = () => {
    if (codeBuffer.length === 0) return;

    const content = codeBuffer.join("\n");

    if (content.trim().length > 0) {
      drafts.push({ type: codeBlockType, content });
    }

    codeBuffer = [];
    codeBlockType = "code";
  };

  for (const rawLine of lines) {
    const normalizedLine = rawLine.replace(/\t/g, "  ");
    const trimmedLine = normalizedLine.trim();

    if (insideCode) {
      if (trimmedLine.startsWith("```") || trimmedLine === "```") {
        flushCode();
        insideCode = false;
        continue;
      }

      codeBuffer.push(normalizedLine);
      continue;
    }

    const fenceMatch = trimmedLine.match(/^```(?<lang>\w+)?\s*$/);
    if (fenceMatch) {
      flushParagraph();
      flushList();
      insideCode = true;
      const lang = fenceMatch.groups?.lang?.toLowerCase();
      codeBlockType =
        lang && ARCHITECTURE_LANGUAGES.has(lang) ? "architecture" : "code";
      continue;
    }

    if (trimmedLine === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmedLine)) {
      flushParagraph();
      flushList();
      drafts.push({ type: "title", content: trimmedLine });
      continue;
    }

    if (/^\s*([-*]|\d+\.)\s+/.test(normalizedLine)) {
      flushParagraph();
      listBuffer.push(normalizedLine);
      continue;
    }

    if (listBuffer.length > 0) {
      flushList();
    }

    paragraphBuffer.push(normalizedLine);
  }

  flushParagraph();
  flushList();
  flushCode();

  return drafts.map((draft, index) => ({
    id: createId(),
    type: draft.type,
    content: draft.content,
    position: index + 1,
  }));
}
