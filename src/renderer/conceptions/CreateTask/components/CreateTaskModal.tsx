import { memo, useActionState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";

import { ConfirmModel } from "@composites/ConfirmModel";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";
import { useFormStatus } from "react-dom";

const Fields = () => {
  const { pending } = useFormStatus();

  return (
    <TextField
      data-testid="create-task-name"
      name="name"
      id="create-task-name"
      label="Task Name"
      placeholder="My agent prompt task"
      autoFocus
      autoComplete="off"
      fullWidth
      disabled={pending}
    />
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (projectId === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const response = await window.electron.invoke.createTask({
          name,
          projectId,
        });

        if (response !== undefined) {
          closeModal();
          onSuccess(response);
        }

        return undefined;
      },
      [closeModal, onSuccess, projectId]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    closeModal();
  }, []);

  const isModalOpen = isOpen && projectId !== undefined;

  return (
    <ConfirmModel
      title="Create a new task"
      description="Set the task name for this project."
      isOpen={isModalOpen}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Create Task"
      confirmPendingLabel="Creating..."
      formTestId="create-task-form"
      messageTestId="create-task-message"
      content={<Fields />}
    />
  );
});
