import {
  ChangeEvent,
  memo,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import { Popup } from "@composites/Popup";
import {
  useArchitectureContentValueSelector,
  useArchitectureModalOpenSelector,
  useSetArchitectureContentDispatch,
} from "../context";
import { useArchitectureModalActions } from "../hooks";
import type {
  TArchitectureModalProps,
  TArchitectureNodeDraft,
  TFieldsProps,
  TNodeFieldsProps,
} from "./types";
import { createId } from "@utils/generation";
import {
  buildArchitectureContent,
  normalizeArchitectureNodes,
  normalizeRootPath,
  parseArchitectureContent,
  type TArchitectureNode,
  type TArchitectureNodeInput,
} from "../utils";

const createNodeDraft = (
  node?: Partial<TArchitectureNodeDraft>
): TArchitectureNodeDraft => ({
  id: node?.id ?? createId(),
  name: node?.name ?? "",
  children: node?.children ?? [],
});

const toDraftNodes = (nodes: TArchitectureNode[]): TArchitectureNodeDraft[] =>
  nodes.map((node) =>
    createNodeDraft({
      name: node.name,
      children: toDraftNodes(node.children),
    })
  );

const mapDraftsToInput = (
  nodes: TArchitectureNodeDraft[]
): TArchitectureNodeInput[] =>
  nodes.map((node) => ({
    name: node.name,
    children: mapDraftsToInput(node.children),
  }));

const buildInitialState = (contentValue?: TMarkdownContent) => {
  if (!contentValue) {
    return {
      rootPath: "src/renderer/",
      nodes: [createNodeDraft()],
    };
  }

  const parsed = parseArchitectureContent(contentValue.content);
  const hasParsedNodes = parsed.nodes.length > 0;

  return {
    rootPath: parsed.rootPath || "src/renderer/",
    nodes: hasParsedNodes ? toDraftNodes(parsed.nodes) : [createNodeDraft()],
  };
};

const NodeFields = memo(
  ({
    node,
    depth,
    index,
    onChangeNodeName,
    onRemoveNode,
    onAddChild,
  }: TNodeFieldsProps) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChangeNodeName(node.id, event.target.value),
      [node.id, onChangeNodeName]
    );

    return (
      <Stack spacing={0.75} pl={depth * 2.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            name="architecture-item"
            label={depth === 0 ? `Item ${index + 1}` : `Nested ${index + 1}`}
            placeholder="Enter folder or file"
            value={node.name}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
            autoFocus={depth === 0 && index === 0}
          />
          <IconButton
            aria-label="remove architecture item"
            color="inherit"
            onClick={() => onRemoveNode(node.id)}
            size="small"
            sx={{ mt: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack spacing={0.5} pl={4}>
          {node.children.map((child, childIndex) => (
            <NodeFields
              key={child.id}
              node={child}
              depth={depth + 1}
              index={childIndex}
              onChangeNodeName={onChangeNodeName}
              onRemoveNode={onRemoveNode}
              onAddChild={onAddChild}
            />
          ))}

          <Tooltip placement="right" arrow title="Add nested item">
            <IconButton
              aria-label="add nested item"
              color="primary"
              onClick={() => onAddChild(node.id)}
              size="small"
              sx={{ width: "fit-content" }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }
);

const Fields = memo(
  ({
    rootPath,
    onChangeRootPath,
    nodes,
    onChangeNodeName,
    onAddNode,
    onRemoveNode,
    onAddChild,
    controlPanel,
  }: TFieldsProps) => {
    const handleRootChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChangeRootPath(event.target.value);
      },
      [onChangeRootPath]
    );

    return (
      <Stack spacing={1}>
        {Boolean(controlPanel) && controlPanel}

        <TextField
          name="architecture-root"
          label="Root path"
          placeholder="src/renderer/"
          value={rootPath}
          onChange={handleRootChange}
          autoComplete="off"
          fullWidth
        />

        <Stack spacing={1.25}>
          {nodes.map((node, index) => (
            <NodeFields
              key={node.id}
              node={node}
              depth={0}
              index={index}
              onChangeNodeName={onChangeNodeName}
              onRemoveNode={onRemoveNode}
              onAddChild={onAddChild}
            />
          ))}

          <Tooltip placement="top" arrow title="Add architecture item">
            <IconButton
              aria-label="add architecture item"
              color="primary"
              onClick={onAddNode}
              size="small"
              sx={{ width: "fit-content" }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    );
  }
);

export const ArchitectureModal = memo(
  ({
    onSuccess,
    onUpdate,
    contents,
    controlPanel,
  }: TArchitectureModalProps) => {
    const isOpen = useArchitectureModalOpenSelector();
    const contentValue = useArchitectureContentValueSelector();

    const { closeModal } = useArchitectureModalActions();
    const setContent = useSetArchitectureContentDispatch();

    const [rootPath, setRootPath] = useState(
      () => buildInitialState(contentValue).rootPath
    );
    const [nodes, setNodes] = useState<TArchitectureNodeDraft[]>(
      () => buildInitialState(contentValue).nodes
    );

    useEffect(() => {
      const initial = buildInitialState(contentValue);
      setRootPath(initial.rootPath);
      setNodes(initial.nodes);
    }, [contentValue]);

    const handleAddNode = useCallback(() => {
      setNodes((prev) => [...prev, createNodeDraft()]);
    }, []);

    const handleRemoveNode = useCallback((targetId: string) => {
      setNodes((prev) => {
        const next = removeNode(prev, targetId);
        return next.length === 0 ? [createNodeDraft()] : next;
      });
    }, []);

    const handleChangeNodeName = useCallback((id: string, value: string) => {
      setNodes((prev) => updateNode(prev, id, { name: value }));
    }, []);

    const handleAddChild = useCallback((parentId: string) => {
      setNodes((prev) => addChild(prev, parentId));
    }, []);

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, _formData: FormData): Promise<undefined> => {
          const normalizedRoot = normalizeRootPath(rootPath);
          const normalizedNodes = normalizeArchitectureNodes(
            mapDraftsToInput(nodes)
          );
          const architectureContent = buildArchitectureContent(
            normalizedRoot,
            normalizedNodes
          );
          const isEditing = Boolean(contentValue);

          if (!architectureContent) {
            return undefined;
          }

          const content: TMarkdownContent = {
            id: contentValue?.id ?? createId(),
            type: "architecture",
            content: architectureContent,
            position: contentValue?.position ?? position,
          };

          if (isEditing && onUpdate) {
            onUpdate(content);
          } else {
            onSuccess(content);
          }

          handleClose();

          return undefined;
        },
        [
          contentValue,
          handleClose,
          nodes,
          onSuccess,
          onUpdate,
          position,
          rootPath,
        ]
      ),
      undefined
    );

    const modalTitle = contentValue ? "Edit architecture" : "Add architecture";
    const confirmLabel = contentValue
      ? "Save Architecture"
      : "Add Architecture";
    const confirmPendingLabel = contentValue ? "Saving..." : "Adding...";

    return (
      <Popup
        title={modalTitle}
        description="Document the project folder structure."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel={confirmLabel}
        confirmPendingLabel={confirmPendingLabel}
        formTestId="architecture-modal-form"
        messageTestId="architecture-modal-message"
        content={
          <Fields
            rootPath={rootPath}
            onChangeRootPath={setRootPath}
            nodes={nodes}
            onChangeNodeName={handleChangeNodeName}
            onAddNode={handleAddNode}
            onRemoveNode={handleRemoveNode}
            onAddChild={handleAddChild}
            controlPanel={controlPanel}
          />
        }
      />
    );
  }
);

ArchitectureModal.displayName = "ArchitectureModal";

function getNextPosition(contents: TMarkdownContent[]): number {
  if (contents.length === 0) {
    return 1;
  }

  const latestPosition = Math.max(
    ...contents.map((contentItem) => contentItem.position)
  );

  return latestPosition + 1;
}

function updateNode(
  nodes: TArchitectureNodeDraft[],
  targetId: string,
  payload: Partial<TArchitectureNodeDraft>
): TArchitectureNodeDraft[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return {
        ...node,
        ...payload,
      };
    }

    const children = updateNode(node.children, targetId, payload);

    if (children !== node.children) {
      return { ...node, children };
    }

    return node;
  });
}

function addChild(
  nodes: TArchitectureNodeDraft[],
  parentId: string
): TArchitectureNodeDraft[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, createNodeDraft()],
      };
    }

    const children = addChild(node.children, parentId);

    if (children !== node.children) {
      return { ...node, children };
    }

    return node;
  });
}

function removeNode(
  nodes: TArchitectureNodeDraft[],
  targetId: string
): TArchitectureNodeDraft[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: removeNode(node.children, targetId),
    }));
}
