import { ReactNode } from "react";
import { type TListStyle } from "@conceptions/Task/Markdown/utils/types";

export type TListModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
  controlPanel?: ReactNode;
};

export type TListItemDraft = {
  id: string;
  value: string;
  subitems: Array<{ id: string; value: string }>;
};

export type TFieldsProps = {
  items: TListItemDraft[];
  onAddItem: () => void;
  onChangeItem: (index: number, value: string) => void;
  onRemoveItem: (index: number) => void;
  onAddSubItem: (parentIndex: number) => void;
  onChangeSubItem: (
    parentIndex: number,
    subIndex: number,
    value: string
  ) => void;
  onRemoveSubItem: (parentIndex: number, subIndex: number) => void;
  listStyle: TListStyle;
  onChangeListStyle: (value: TListStyle) => void;
  controlPanel?: ReactNode;
};
