import { memo, useActionState, useCallback } from "react";

import {
  useDeleteTaskModalTaskSelector,
  useSetDeleteTaskModalTaskDispatch,
} from "../context";
import { ConfirmModel } from "@composites/ConfirmModel";
import { TDeleteTaskModalProps } from "./types";

export const DeleteTaskModal = memo(({ onSuccess }: TDeleteTaskModalProps) => {
  const task = useDeleteTaskModalTaskSelector();
  const setTask = useSetDeleteTaskModalTaskDispatch();

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, _formData: FormData): Promise<undefined> => {
        if (task === undefined) {
          return undefined;
        }

        const response = await window.electron.invoke.deleteTask({
          id: task.id,
        });

        if (response === true) {
          onSuccess(task.id);
          setTask(undefined);
        }

        return undefined;
      },
      [task?.id]
    ),
    undefined
  );

  const handlerClose = useCallback(() => {
    setTask(undefined);
  }, []);

  return (
    <ConfirmModel
      title="Delete task"
      isOpen={task !== undefined}
      onClose={handlerClose}
      description={
        task !== undefined
          ? `Are you sure you want to delete "${task.name}"? This action cannot be undone.`
          : ""
      }
      formAction={formAction}
      confirmLabel="Apply"
      confirmPendingLabel="Deleting..."
      confirmColor="error"
      formTestId="delete-task-form"
      messageTestId="delete-task-message"
    />
  );
});

DeleteTaskModal.displayName = "DeleteTaskModal";
