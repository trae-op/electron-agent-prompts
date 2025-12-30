import { createId } from "@utils/generation";
import {
  TArchitectureNode,
  TArchitectureNodeDraft,
  TArchitectureNodeInput,
} from "./type";
import { parseArchitectureContent } from "./tree";

export function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}

export function collectNodeDraftValues(
  nodes: TArchitectureNodeDraft[],
  draftValues: Map<string, string>
): void {
  nodes.forEach((node) => {
    draftValues.set(node.id, node.name);
    collectNodeDraftValues(node.children, draftValues);
  });
}

export function deleteDraftValues(
  node: TArchitectureNodeDraft,
  draftValues: Map<string, string>
): void {
  draftValues.delete(node.id);
  node.children.forEach((child) => deleteDraftValues(child, draftValues));
}

export function findNodeById(
  nodes: TArchitectureNodeDraft[],
  targetId: string
): TArchitectureNodeDraft | undefined {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }

    const child = findNodeById(node.children, targetId);

    if (child) {
      return child;
    }
  }

  return undefined;
}

export function addChild(
  nodes: TArchitectureNodeDraft[],
  parentId: string,
  child: TArchitectureNodeDraft
): TArchitectureNodeDraft[] {
  let didChange = false;

  const nextNodes = nodes.map((node) => {
    if (node.id === parentId) {
      didChange = true;
      return {
        ...node,
        children: [...node.children, child],
      };
    }

    const children = addChild(node.children, parentId, child);

    if (children !== node.children) {
      didChange = true;
      return { ...node, children };
    }

    return node;
  });

  return didChange ? nextNodes : nodes;
}

export function moveNode(
  nodes: TArchitectureNodeDraft[],
  targetId: string,
  direction: "up" | "down"
): TArchitectureNodeDraft[] {
  const index = nodes.findIndex((node) => node.id === targetId);

  if (index !== -1) {
    const isAtBoundary =
      (direction === "up" && index === 0) ||
      (direction === "down" && index === nodes.length - 1);

    if (isAtBoundary) {
      return nodes;
    }

    const next = [...nodes];
    const [target] = next.splice(index, 1);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    next.splice(nextIndex, 0, target);
    return next;
  }

  for (let i = 0; i < nodes.length; i += 1) {
    const children = moveNode(nodes[i].children, targetId, direction);

    if (children !== nodes[i].children) {
      const nextNodes = [...nodes];
      nextNodes[i] = { ...nodes[i], children };
      return nextNodes;
    }
  }

  return nodes;
}

export function removeNode(
  nodes: TArchitectureNodeDraft[],
  targetId: string
): TArchitectureNodeDraft[] {
  let didChange = false;

  const filtered = nodes
    .map((node) => {
      if (node.id === targetId) {
        didChange = true;
        return undefined;
      }

      const children = removeNode(node.children, targetId);

      if (children !== node.children) {
        didChange = true;
        return { ...node, children };
      }

      return node;
    })
    .filter(Boolean) as TArchitectureNodeDraft[];

  return didChange ? filtered : nodes;
}

export const createNodeDraft = (
  node?: Partial<TArchitectureNodeDraft>
): TArchitectureNodeDraft => ({
  id: node?.id ?? createId(),
  name: node?.name ?? "",
  children: node?.children ?? [],
});

export const toDraftNodes = (
  nodes: TArchitectureNode[]
): TArchitectureNodeDraft[] =>
  nodes.map((node) =>
    createNodeDraft({
      name: node.name,
      children: toDraftNodes(node.children),
    })
  );

export const mapDraftsToInput = (
  nodes: TArchitectureNodeDraft[],
  draftValues: Map<string, string>
): TArchitectureNodeInput[] =>
  nodes.map((node) => ({
    name: draftValues.get(node.id) ?? node.name,
    children: mapDraftsToInput(node.children, draftValues),
  }));

export const buildInitialState = (contentValue?: TMarkdownContent) => {
  if (!contentValue) {
    return {
      rootPath: "",
      nodes: [createNodeDraft()],
    };
  }

  const parsed = parseArchitectureContent(contentValue.content);
  const hasParsedNodes = parsed.nodes.length > 0;

  return {
    rootPath: parsed.rootPath || "",
    nodes: hasParsedNodes ? toDraftNodes(parsed.nodes) : [createNodeDraft()],
  };
};
