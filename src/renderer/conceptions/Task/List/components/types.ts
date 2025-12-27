import { ReactNode } from "react";

export type TListModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
  controlPanel?: ReactNode;
};

type TListStyle = "bullet" | "numbered";

export type TFieldsProps = {
  items: string[];
  onAddItem: () => void;
  onChangeItem: (index: number, value: string) => void;
  onRemoveItem: (index: number) => void;
  listStyle: TListStyle;
  onChangeListStyle: (value: TListStyle) => void;
  controlPanel?: ReactNode;
};
