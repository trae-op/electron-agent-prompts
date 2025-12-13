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
  formAction: (payload: FormData) => void;
  onClose?: () => void;
  confirmLabel?: string;
  confirmPendingLabel?: string;
  confirmColor?: ButtonProps["color"];
  formTestId?: string;
  messageTestId?: string;
};

export type TCancelButtonProps = {
  handlerClose: () => void;
};
