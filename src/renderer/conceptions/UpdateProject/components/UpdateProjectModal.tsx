import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useUpdateProjectModalActions } from "../hooks";
import {
  useUpdateProjectModalOpenSelector,
  useUpdateProjectModalProjectSelector,
} from "../context";
import { TUpdateProjectFormProps, TUpdateProjectModalProps } from "./types";

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
  ({
    project,
    formAction,
    isPending,
    handleClose,
  }: TUpdateProjectFormProps) => {
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
            Update project
          </Typography>
          <form
            action={formAction}
            noValidate
            data-testid="update-project-form"
          >
            <Stack spacing={2.5}>
              <TextField
                key={project.id}
                data-testid="update-project-name"
                name="name"
                id="update-project-name"
                label="Project Name"
                placeholder="My agent prompt project"
                defaultValue={project.name}
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

Form.displayName = "UpdateProjectForm";

export const UpdateProjectModal = memo(
  ({ onSuccess }: TUpdateProjectModalProps) => {
    const isOpen = useUpdateProjectModalOpenSelector();
    const project = useUpdateProjectModalProjectSelector();
    const { closeModal } = useUpdateProjectModalActions();

    const [_, formAction, isPending] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          if (project === undefined) {
            return undefined;
          }

          const rawName = formData.get("name");
          const name = typeof rawName === "string" ? rawName.trim() : "";

          const response = await window.electron.invoke.updateProject({
            id: project.id,
            name,
          });

          if (response !== undefined) {
            onSuccess(response);
            closeModal();
          }

          return undefined;
        },
        [closeModal, onSuccess, project]
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
          {project !== undefined && (
            <Form
              project={project}
              formAction={formAction}
              isPending={isPending}
              handleClose={handleClose}
            />
          )}
        </Box>
      </Modal>
    );
  }
);

UpdateProjectModal.displayName = "UpdateProjectModal";
