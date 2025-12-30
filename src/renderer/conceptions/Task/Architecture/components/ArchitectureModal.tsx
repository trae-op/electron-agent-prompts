import {
  ChangeEvent,
  memo,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Popup } from "@composites/Popup";
import {
  useArchitectureContentValueSelector,
  useArchitectureModalOpenSelector,
  useSetArchitectureContentDispatch,
} from "../context";
import { useArchitectureModalActions } from "../hooks";
import type {
  TArchitectureModalProps,
  TFieldsProps,
  TNodeFieldsProps,
} from "./types";
import { createId } from "@utils/generation";
import {
  buildArchitectureContent,
  normalizeArchitectureNodes,
  normalizeRootPath,
  addChild,
  buildInitialState,
  collectNodeDraftValues,
  createNodeDraft,
  deleteDraftValues,
  findNodeById,
  getNextPosition,
  mapDraftsToInput,
  moveNode,
  removeNode,
} from "../utils";
import { TArchitectureNodeDraft } from "../utils/type";

const NodeFields = memo(
  ({
    node,
    depth,
    index,
    siblingsLength,
    nameValue,
    onChangeNodeName,
    onRemoveNode,
    onAddChild,
    onMoveNodeUp,
    onMoveNodeDown,
    getNodeNameValue,
  }: TNodeFieldsProps) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChangeNodeName(node.id, event.target.value),
      [node.id, onChangeNodeName]
    );
    const handlerRemoveNode = useCallback(() => {
      onRemoveNode(node.id);
    }, [node.id, onRemoveNode]);

    const handlerAddChild = useCallback(() => {
      onAddChild(node.id);
    }, [node.id, onAddChild]);

    const handleMoveUp = useCallback(() => {
      onMoveNodeUp(node.id);
    }, [node.id, onMoveNodeUp]);

    const handleMoveDown = useCallback(() => {
      onMoveNodeDown(node.id);
    }, [node.id, onMoveNodeDown]);

    return (
      <Stack spacing={0.75}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <TextField
            name="architecture-item"
            label={depth === 0 ? `Item ${index + 1}` : `Nested ${index + 1}`}
            placeholder="Enter folder or file"
            defaultValue={nameValue}
            onChange={handleChange}
            autoComplete="off"
            fullWidth
            autoFocus={depth === 0 && index === 0}
          />
          <Tooltip placement="top" arrow title="Move up">
            <span>
              <IconButton
                aria-label="move architecture item up"
                color="inherit"
                onClick={handleMoveUp}
                size="small"
                disabled={index === 0}
                sx={{ mt: 0.5 }}
              >
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip placement="top" arrow title="Move down">
            <span>
              <IconButton
                aria-label="move architecture item down"
                color="inherit"
                onClick={handleMoveDown}
                size="small"
                disabled={index === siblingsLength - 1}
                sx={{ mt: 0.5 }}
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton
            aria-label="remove architecture item"
            color="inherit"
            onClick={handlerRemoveNode}
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
              siblingsLength={node.children.length}
              nameValue={getNodeNameValue(child.id, child.name)}
              onChangeNodeName={onChangeNodeName}
              onRemoveNode={onRemoveNode}
              onAddChild={onAddChild}
              onMoveNodeUp={onMoveNodeUp}
              onMoveNodeDown={onMoveNodeDown}
              getNodeNameValue={getNodeNameValue}
            />
          ))}

          <Tooltip placement="right" arrow title="Add nested item">
            <IconButton
              aria-label="add nested item"
              color="primary"
              onClick={handlerAddChild}
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
    rootPathDefaultValue,
    rootPathInputKey,
    onChangeRootPath,
    nodes,
    getNodeNameValue,
    onChangeNodeName,
    onAddNode,
    onRemoveNode,
    onAddChild,
    onMoveNodeUp,
    onMoveNodeDown,
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
          placeholder="src/"
          key={rootPathInputKey}
          defaultValue={rootPathDefaultValue}
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
              siblingsLength={nodes.length}
              nameValue={getNodeNameValue(node.id, node.name)}
              getNodeNameValue={getNodeNameValue}
              onChangeNodeName={onChangeNodeName}
              onRemoveNode={onRemoveNode}
              onAddChild={onAddChild}
              onMoveNodeUp={onMoveNodeUp}
              onMoveNodeDown={onMoveNodeDown}
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
  ({ onSuccess, onUpdate, contents }: TArchitectureModalProps) => {
    const isOpen = useArchitectureModalOpenSelector();
    const contentValue = useArchitectureContentValueSelector();

    const { closeModal } = useArchitectureModalActions();
    const setContent = useSetArchitectureContentDispatch();

    const initialState = useMemo(
      () => buildInitialState(contentValue),
      [contentValue]
    );

    const [rootPathDefaultValue, setRootPathDefaultValue] = useState(
      initialState.rootPath
    );
    const [rootPathInputKey, setRootPathInputKey] = useState(() => createId());
    const [nodes, setNodes] = useState<TArchitectureNodeDraft[]>(
      initialState.nodes
    );

    const rootPathDraftRef = useRef<string>(initialState.rootPath);
    const nodeNameDraftValuesRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
      const initial = buildInitialState(contentValue);
      setRootPathDefaultValue(initial.rootPath);
      setNodes(initial.nodes);
      rootPathDraftRef.current = initial.rootPath;
      setRootPathInputKey(createId());

      const draftValues = new Map<string, string>();
      collectNodeDraftValues(initial.nodes, draftValues);
      nodeNameDraftValuesRef.current = draftValues;
    }, [contentValue]);

    const handleChangeRootPath = useCallback((value: string) => {
      rootPathDraftRef.current = value;
    }, []);

    const handleAddNode = useCallback(() => {
      const nextNode = createNodeDraft();
      nodeNameDraftValuesRef.current.set(nextNode.id, nextNode.name);

      setNodes((prev) => [...prev, nextNode]);
    }, []);

    const handleRemoveNode = useCallback((targetId: string) => {
      setNodes((prev) => {
        const targetNode = findNodeById(prev, targetId);

        if (targetNode) {
          deleteDraftValues(targetNode, nodeNameDraftValuesRef.current);
        }

        const next = removeNode(prev, targetId);

        if (next.length === 0) {
          const fallbackNode = createNodeDraft();
          nodeNameDraftValuesRef.current.set(
            fallbackNode.id,
            fallbackNode.name
          );
          return [fallbackNode];
        }

        return next;
      });
    }, []);

    const handleChangeNodeName = useCallback((id: string, value: string) => {
      nodeNameDraftValuesRef.current.set(id, value);
    }, []);

    const handleAddChild = useCallback((parentId: string) => {
      const newChild = createNodeDraft();
      nodeNameDraftValuesRef.current.set(newChild.id, newChild.name);

      setNodes((prev) => addChild(prev, parentId, newChild));
    }, []);

    const handleMoveNodeUp = useCallback((targetId: string) => {
      setNodes((prev) => moveNode(prev, targetId, "up"));
    }, []);

    const handleMoveNodeDown = useCallback((targetId: string) => {
      setNodes((prev) => moveNode(prev, targetId, "down"));
    }, []);

    const handleClose = useCallback(() => {
      setContent(undefined);
      closeModal();
    }, [closeModal, setContent]);

    const getNodeNameValue = useCallback(
      (id: string, fallback: string) =>
        nodeNameDraftValuesRef.current.get(id) ?? fallback,
      []
    );

    const position = useMemo(() => getNextPosition(contents), [contents]);

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, _formData: FormData): Promise<undefined> => {
          const normalizedRoot = normalizeRootPath(rootPathDraftRef.current);
          const normalizedNodes = normalizeArchitectureNodes(
            mapDraftsToInput(nodes, nodeNameDraftValuesRef.current)
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
        [contentValue, handleClose, nodes, onSuccess, onUpdate, position]
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
            rootPathDefaultValue={rootPathDefaultValue}
            rootPathInputKey={rootPathInputKey}
            onChangeRootPath={handleChangeRootPath}
            nodes={nodes}
            getNodeNameValue={getNodeNameValue}
            onChangeNodeName={handleChangeNodeName}
            onAddNode={handleAddNode}
            onRemoveNode={handleRemoveNode}
            onAddChild={handleAddChild}
            onMoveNodeUp={handleMoveNodeUp}
            onMoveNodeDown={handleMoveNodeDown}
          />
        }
      />
    );
  }
);

ArchitectureModal.displayName = "ArchitectureModal";
