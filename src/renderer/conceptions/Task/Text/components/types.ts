import { ReactNode } from "react";

export type TTextModalProps = {
  contents: TMarkdownContent[];
  onSuccess: (data: TMarkdownContent) => void;
  onUpdate?: (data: TMarkdownContent) => void;
  controlPanel?: ReactNode;
};
