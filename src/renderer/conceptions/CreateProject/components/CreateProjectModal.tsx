import { memo, useActionState, useCallback, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useCreateProjectModal } from "../hooks";
import { useLatestCreatedProjectSelector } from "../context";
import { TCreateProjectModalProps } from "./types";

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

export const CreateProjectModal = memo(
  ({ onSuccess }: TCreateProjectModalProps) => {
    const { isOpen, closeModal } = useCreateProjectModal();
    const latestProject = useLatestCreatedProjectSelector();
    const formRef = useRef<HTMLFormElement | null>(null);

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

    useEffect(() => {
      if (latestProject !== undefined) {
        formRef.current?.reset();
      }
    }, [latestProject]);

    useEffect(() => {
      if (!isOpen) {
        formRef.current?.reset();
      }
    }, [isOpen]);

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
          {isOpen ? (
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
                  ref={formRef}
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
                    <Stack
                      direction="row"
                      spacing={1.5}
                      justifyContent="flex-end"
                    >
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
          ) : null}
        </Box>
      </Modal>
    );
  }
);
