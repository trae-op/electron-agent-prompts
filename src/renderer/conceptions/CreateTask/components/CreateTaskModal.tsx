import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskFormProps, TCreateTaskModalProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";
import { useParams } from "react-router-dom";

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
      {pending ? "Creating..." : "Create Task"}
    </Button>
  );
};

const Form = memo(
  ({ formAction, isPending, handleClose }: TCreateTaskFormProps) => {
    const isOpen = useCreateTaskModalOpenSelector();

    if (!isOpen) {
      return null;
    }

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
        }}
      >
        <Stack spacing={3}>
          <Typography component="h2" variant="h6" fontWeight={600}>
            Create a new task
          </Typography>
          <form action={formAction} noValidate data-testid="create-task-form">
            <Stack spacing={2.5}>
              <TextField
                data-testid="create-task-name"
                name="name"
                id="create-task-name"
                label="Task Name"
                placeholder="My agent prompt task"
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

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();

  if (projectId === undefined) {
    return null;
  }

  const projectIdNumber = Number(projectId);

  const [_, formAction, isPending] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const response = await window.electron.invoke.createTask({
          name,
          projectId: projectIdNumber,
        });

        if (response !== undefined) {
          closeModal();
          onSuccess(response);
        }
      },
      [closeModal, onSuccess, projectIdNumber]
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
    <Modal open={isOpen} onClose={handleClose} keepMounted>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Form
          formAction={formAction}
          isPending={isPending}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );
});
