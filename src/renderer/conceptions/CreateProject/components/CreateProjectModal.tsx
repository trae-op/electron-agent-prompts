import { memo, useActionState, useCallback } from "react";
import TextField from "@mui/material/TextField";

import { ConfirmModel } from "@composites/ConfirmModel";
import { useCreateProjectModalActions } from "../hooks";
import { TCreateProjectModalProps } from "./types";
import { useCreateProjectModalOpenSelector } from "../context";
import { useFormStatus } from "react-dom";

const Fields = () => {
  const { pending } = useFormStatus();

  return (
    <TextField
      data-testid="create-project-name"
      name="name"
      id="create-project-name"
      label="Project Name"
      placeholder="My agent prompt project"
      autoFocus
      autoComplete="off"
      fullWidth
      disabled={pending}
    />
  );
};

export const CreateProjectModal = memo(
  ({ onSuccess }: TCreateProjectModalProps) => {
    const isOpen = useCreateProjectModalOpenSelector();
    const { closeModal } = useCreateProjectModalActions();

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawName = formData.get("name");
          const name = typeof rawName === "string" ? rawName.trim() : "";

          const response = await window.electron.invoke.createProject({
            name,
          });

          if (response !== undefined) {
            closeModal();
            onSuccess(response);
          }

          return undefined;
        },
        [closeModal, onSuccess]
      ),
      undefined
    );

    const handleClose = useCallback(() => {
      closeModal();
    }, []);

    return (
      <ConfirmModel
        title="Create a new project"
        description="Set the project name to get started."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel="Create Project"
        confirmPendingLabel="Creating..."
        formTestId="create-project-form"
        messageTestId="create-project-message"
        content={<Fields />}
      />
    );
  }
);
