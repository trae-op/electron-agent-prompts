import { ReactNode } from "react";

export type TArchitectureModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
  controlPanel?: ReactNode;
};

export type TArchitectureNodeDraft = {
  id: string;
  name: string;
  children: TArchitectureNodeDraft[];
};

export type TFieldsProps = {
  rootPath: string;
  onChangeRootPath: (value: string) => void;
  nodes: TArchitectureNodeDraft[];
  onChangeNodeName: (id: string, value: string) => void;
  onAddNode: () => void;
  onRemoveNode: (id: string) => void;
  onAddChild: (parentId: string) => void;
  controlPanel?: ReactNode;
};

export type TNodeFieldsProps = {
  node: TArchitectureNodeDraft;
  depth: number;
  index: number;
  onChangeNodeName: (id: string, value: string) => void;
  onRemoveNode: (id: string) => void;
  onAddChild: (id: string) => void;
};
