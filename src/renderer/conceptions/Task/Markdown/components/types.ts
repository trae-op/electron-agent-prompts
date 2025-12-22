import { ReactNode } from "react";

export type TCreateTaskModalProps = {
  onSuccess: (data: TTask) => void;
};

export type TCreateTaskFormProps = {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  handleClose: () => void;
};

export type THeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TContentActionHandlers = {
  onUpdate?: (content: TMarkdownContent) => void;
  onDelete?: (content: TMarkdownContent) => void;
  onMoveUp?: (content: TMarkdownContent) => void;
  onMoveDown?: (content: TMarkdownContent) => void;
};

export type TContentBlockWrapperProps = {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disableMoveUp?: boolean;
  disableMoveDown?: boolean;
};
