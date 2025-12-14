import { memo, useActionState, useCallback } from "react";
import TextField from "@mui/material/TextField";

import { ConfirmModel } from "@composites/ConfirmModel";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";
import { TUpdateTaskModalProps } from "./types";

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
  const task = useUpdateTaskModalTaskSelector();
  const setUpdateTask = useSetUpdateTaskModalTaskDispatch();

  const [_, formAction, isPending] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (task === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const response = await window.electron.invoke.updateTask({
          id: task.id,
          name,
        });

        if (response !== undefined) {
          onSuccess(response);
          setUpdateTask(undefined);
        }

        return undefined;
      },
      [onSuccess, task]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    setUpdateTask(undefined);
  }, []);

  return (
    <ConfirmModel
      title="Update task"
      description="Update the task name."
      isOpen={task !== undefined}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Save Changes"
      confirmPendingLabel="Saving..."
      formTestId="update-task-form"
      messageTestId="update-task-message"
      content={
        task !== undefined && (
          <TextField
            key={task.id}
            data-testid="update-task-name"
            name="name"
            id="update-task-name"
            label="Task Name"
            placeholder="My agent prompt task"
            defaultValue={task.name}
            autoFocus
            autoComplete="off"
            fullWidth
            disabled={isPending}
          />
        )
      }
    />
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
