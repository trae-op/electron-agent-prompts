import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useUpdateTaskModalActions } from "../hooks";
import {
  useUpdateTaskModalOpenSelector,
  useUpdateTaskModalTaskSelector,
} from "../context";
import { TUpdateTaskFormProps, TUpdateTaskModalProps } from "./types";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      disabled={pending}
      startIcon={
        pending ? <CircularProgress size={16} thickness={5} /> : undefined
      }
      sx={{
        minWidth: 160,
        fontWeight: 600,
        textTransform: "none",
      }}
    >
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
};

const Form = memo(
  ({ task, formAction, isPending, handleClose }: TUpdateTaskFormProps) => {
    return (
      <Box
        component="section"
        sx={{
          width: { xs: "100%", sm: 420 },
          maxWidth: 480,
          bgcolor: "background.paper",
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: (theme) => theme.shadows[6],
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Stack spacing={3}>
          <Typography component="h2" variant="h6" fontWeight={600}>
            Update task
          </Typography>
          <form action={formAction} noValidate data-testid="update-task-form">
            <Stack spacing={2.5}>
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
              <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                <Button
                  type="button"
                  variant="text"
                  color="inherit"
                  onClick={handleClose}
                  disabled={isPending}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton />
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Box>
    );
  }
);

Form.displayName = "UpdateTaskForm";

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
  const isOpen = useUpdateTaskModalOpenSelector();
  const task = useUpdateTaskModalTaskSelector();
  const { closeModal } = useUpdateTaskModalActions();

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
          closeModal();
        }

        return undefined;
      },
      [closeModal, onSuccess, task]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    if (isPending) {
      return;
    }

    closeModal();
  }, [closeModal, isPending]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        {task !== undefined && (
          <Form
            task={task}
            formAction={formAction}
            isPending={isPending}
            handleClose={handleClose}
          />
        )}
      </Box>
    </Modal>
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
