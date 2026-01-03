import type { ButtonProps } from "@mui/material/Button";
import { ReactNode } from "react";

export type TSubmitButtonProps = {
  label: string;
  pendingLabel: string;
  color: ButtonProps["color"];
};

export type TConfirmModelProps = {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  content?: ReactNode;
  formAction: (payload: FormData) => void | Promise<void | undefined>;
  onClose?: () => void;
  confirmLabel?: string;
  confirmPendingLabel?: string;
  confirmColor?: ButtonProps["color"];
  formTestId?: string;
  messageTestId?: string;
  isScrollBar?: boolean;
};

export type TCancelButtonProps = {
  handlerClose: () => void;
};
