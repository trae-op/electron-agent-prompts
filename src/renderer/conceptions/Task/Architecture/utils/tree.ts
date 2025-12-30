import {
  TArchitectureNode,
  TArchitectureNodeInput,
  TParsedArchitecture,
} from "./type";

const BRANCH = "├── ";
const LAST_BRANCH = "└── ";
const CONTINUE_PREFIX = "│   ";
const EMPTY_PREFIX = "    ";

export function normalizeRootPath(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const lastChar = trimmed.at(-1) ?? "";
  const hasTrailingSlash = lastChar === "/" || lastChar === "\\";

  return hasTrailingSlash ? trimmed : `${trimmed}/`;
}

export function normalizeArchitectureNodes(
  nodes: TArchitectureNodeInput[]
): TArchitectureNode[] {
  const result: TArchitectureNode[] = [];

  nodes.forEach((node) => {
    const name = (node.name ?? "").trim();
    const children = normalizeArchitectureNodes(node.children ?? []);

    if (!name) {
      result.push(...children);
      return;
    }

    result.push({ name, children });
  });

  return result;
}

export function buildArchitectureContent(
  rootPath: string,
  nodes: TArchitectureNodeInput[]
): string {
  const normalizedRoot = normalizeRootPath(rootPath);
  const normalizedNodes = normalizeArchitectureNodes(nodes);

  if (!normalizedRoot || normalizedNodes.length === 0) {
    return "";
  }

  const lines: string[] = [normalizedRoot];

  const visit = (items: TArchitectureNode[], prefix: string) => {
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const connector = isLast ? LAST_BRANCH : BRANCH;
      const nextPrefix = isLast ? EMPTY_PREFIX : CONTINUE_PREFIX;

      lines.push(`${prefix}${connector}${item.name}`);

      if (item.children.length > 0) {
        visit(item.children, `${prefix}${nextPrefix}`);
      }
    });
  };

  visit(normalizedNodes, "");

  return lines.join("\n");
}

export function parseArchitectureContent(
  content?: string
): TParsedArchitecture {
  if (!content) {
    return { rootPath: "", nodes: [] };
  }

  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { rootPath: "", nodes: [] };
  }

  const rootPath = lines[0].trim();
  const root: TArchitectureNode = { name: rootPath, children: [] };
  const stack: TArchitectureNode[] = [root];

  const linePattern =
    /^(?<prefix>(?:[│|]\s{3}|\s{4})*)(?:├── |└── )(?<name>.+)$/;

  for (const rawLine of lines.slice(1)) {
    const match = rawLine.match(linePattern);

    if (match === null || match.groups?.name === undefined) {
      continue;
    }

    const name = match.groups.name.trim();
    const prefix = match.groups.prefix ?? "";
    const depth = Math.floor(prefix.length / 4) + 1;
    const node: TArchitectureNode = { name, children: [] };

    while (stack.length > depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1] ?? root;
    parent.children.push(node);
    stack[depth] = node;
  }

  return { rootPath: normalizeRootPath(root.name), nodes: root.children };
}
