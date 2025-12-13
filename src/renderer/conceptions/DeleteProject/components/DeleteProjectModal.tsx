import { memo, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useDeleteProjectModalActions } from "../hooks";
import {
  useDeleteProjectModalOpenSelector,
  useDeleteProjectModalProjectSelector,
} from "../context";
import { TDeleteProjectFormProps, TDeleteProjectModalProps } from "./types";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      color="error"
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
      {pending ? "Deleting..." : "Delete Project"}
    </Button>
  );
};

const Form = memo(
  ({
    project,
    formAction,
    isPending,
    handleClose,
  }: TDeleteProjectFormProps) => {
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
            Delete project
          </Typography>
          <Typography
            color="text.secondary"
            data-testid="delete-project-message"
          >
            Are you sure you want to delete "{project.name}"? This action cannot
            be undone.
          </Typography>
          <form
            action={formAction}
            noValidate
            data-testid="delete-project-form"
          >
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
          </form>
        </Stack>
      </Box>
    );
  }
);

Form.displayName = "DeleteProjectForm";

export const DeleteProjectModal = memo(
  ({ onSuccess }: TDeleteProjectModalProps) => {
    const isOpen = useDeleteProjectModalOpenSelector();
    const project = useDeleteProjectModalProjectSelector();
    const { closeModal } = useDeleteProjectModalActions();

    const [_, formAction, isPending] = useActionState(
      useCallback(
        async (_state: undefined, _formData: FormData): Promise<undefined> => {
          if (project?.id === undefined) {
            return undefined;
          }

          const response = await window.electron.invoke.deleteProject({
            id: project.id,
          });

          if (response === true) {
            onSuccess(project.id);
            closeModal();
          }

          return undefined;
        },
        [project?.id]
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

DeleteProjectModal.displayName = "DeleteProjectModal";
