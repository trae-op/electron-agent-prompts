import { ReactNode } from "react";
import { TArchitectureNodeDraft } from "../utils/type";

export type TArchitectureModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
};

export type TFieldsProps = {
  rootPathDefaultValue: string;
  rootPathInputKey: string;
  onChangeRootPath: (value: string) => void;
  nodes: TArchitectureNodeDraft[];
  getNodeNameValue: (id: string, fallback: string) => string;
  onChangeNodeName: (id: string, value: string) => void;
  onAddNode: () => void;
  onRemoveNode: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onMoveNodeUp: (id: string) => void;
  onMoveNodeDown: (id: string) => void;
  controlPanel?: ReactNode;
};

export type TNodeFieldsProps = {
  node: TArchitectureNodeDraft;
  depth: number;
  index: number;
  siblingsLength: number;
  nameValue: string;
  getNodeNameValue: (id: string, fallback: string) => string;
  onChangeNodeName: (id: string, value: string) => void;
  onRemoveNode: (id: string) => void;
  onAddChild: (id: string) => void;
  onMoveNodeUp: (id: string) => void;
  onMoveNodeDown: (id: string) => void;
};
