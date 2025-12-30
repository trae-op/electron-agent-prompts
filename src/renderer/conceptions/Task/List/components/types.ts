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
  onChangeItem: (itemId: string, value: string) => void;
  onRemoveItem: (index: number) => void;
  onMoveItemUp: (index: number) => void;
  onMoveItemDown: (index: number) => void;
  onAddSubItem: (parentIndex: number) => void;
  onChangeSubItem: (subitemId: string, value: string) => void;
  onRemoveSubItem: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemUp: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemDown: (parentIndex: number, subIndex: number) => void;
  listStyle: TListStyle;
  onChangeListStyle: (value: TListStyle) => void;
  controlPanel?: ReactNode;
};

export type TSubItemTextFieldProps = {
  defaultValue: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export type TSubItemRowProps = {
  subitem: { id: string; value: string };
  parentIndex: number;
  subIndex: number;
  subitemsLength: number;
  onChangeSubItem: (subitemId: string, value: string) => void;
  onRemoveSubItem: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemUp: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemDown: (parentIndex: number, subIndex: number) => void;
};

export type TListItemProps = {
  item: TListItemDraft;
  index: number;
  itemsLength: number;
  onChangeItem: (itemId: string, value: string) => void;
  onRemoveItem: (index: number) => void;
  onMoveItemUp: (index: number) => void;
  onMoveItemDown: (index: number) => void;
  onAddSubItem: (parentIndex: number) => void;
  onChangeSubItem: (subitemId: string, value: string) => void;
  onRemoveSubItem: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemUp: (parentIndex: number, subIndex: number) => void;
  onMoveSubItemDown: (parentIndex: number, subIndex: number) => void;
};

export type TItemTextFieldProps = {
  defaultValue: string;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
};
