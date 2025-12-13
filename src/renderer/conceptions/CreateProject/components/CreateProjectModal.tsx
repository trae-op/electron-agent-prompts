import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useCreateProjectModalActions } from "../hooks";
import { TCreateProjectFormProps, TCreateProjectModalProps } from "./types";
import { useCreateProjectModalOpenSelector } from "../context";

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
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
};

const Form = memo(
  ({ formAction, isPending, handleClose }: TCreateProjectFormProps) => {
    const isOpen = useCreateProjectModalOpenSelector();

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
            Create a new project
          </Typography>
          <form
            action={formAction}
            noValidate
            data-testid="create-project-form"
          >
            <Stack spacing={2.5}>
              <TextField
                data-testid="create-project-name"
                name="name"
                id="create-project-name"
                label="Project Name"
                placeholder="My agent prompt project"
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

export const CreateProjectModal = memo(
  ({ onSuccess }: TCreateProjectModalProps) => {
    const isOpen = useCreateProjectModalOpenSelector();
    const { closeModal } = useCreateProjectModalActions();

    const [_, formAction, isPending] = useActionState(
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
        },
        [closeModal]
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
          <Form
            formAction={formAction}
            isPending={isPending}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    );
  }
);
