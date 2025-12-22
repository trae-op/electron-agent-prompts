import { TTokenType } from "./types";

export function normalizeHeading<H>(content: string): {
  headingVariant: H;
  text: string;
} {
  const match = content.match(/^(#{1,6})\s+(.*)$/);
  if (!match) {
    return { headingVariant: "h2" as H, text: content };
  }

  const [, hashes, text] = match;
  const depth = Math.min(hashes.length, 6);
  const variant = `h${depth}` as H;

  return { headingVariant: variant, text };
}

export function splitListItems(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^(?:[-*]\s+)?/, ""));
}

export function pickColor(type: TTokenType, theme: any): string | undefined {
  switch (type) {
    case "keyword":
      return theme.palette.primary.main;
    case "string":
      return theme.palette.success.main;
    case "number":
      return theme.palette.info.main;
    case "operator":
      return theme.palette.warning.main;
    case "comment":
      return theme.palette.text.secondary;
    default:
      return undefined;
  }
}

export function detectType(token: string): TTokenType {
  if (/^\/\//.test(token) || /^\/\*/.test(token)) return "comment";
  if (/^"/.test(token) || /^'/.test(token) || /^`/.test(token)) return "string";
  if (keywordPattern.test(token)) return "keyword";
  if (/^\d/.test(token)) return "number";
  if (operatorPattern.test(token)) return "operator";
  return "text";
}

const keywordPattern =
  /\b(const|let|var|function|return|if|else|type|interface|extends|implements|new|import|from|export|default|class|async|await|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in)\b/;

const operatorPattern = /(===|==|=>|<=|>=|&&|\|\||!=|!==|[=+\-*/%!?<>])/;

const codeTokenizer =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|===|==|=>|<=|>=|&&|\|\||!=|!==|[=+\-*/%!?<>]|\b(?:const|let|var|function|return|if|else|type|interface|extends|implements|new|import|from|export|default|class|async|await|try|catch|finally|throw|switch|case|break|continue|for|while|do|of|in)\b)/g;

export function tokenizeSegments(
  text: string
): Array<{ value: string; type: TTokenType }> {
  const segments: Array<{ value: string; type: TTokenType }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(codeTokenizer)) {
    const matchText = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      segments.push({ value: text.slice(lastIndex, start), type: "text" });
    }

    segments.push({ value: matchText, type: detectType(matchText) });
    lastIndex = start + matchText.length;
  }

  if (lastIndex < text.length) {
    segments.push({ value: text.slice(lastIndex), type: "text" });
  }

  return segments;
}
