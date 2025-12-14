import { memo, useCallback } from "react";
import { useFormStatus } from "react-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type {
  TCancelButtonProps,
  TConfirmModelProps,
  TSubmitButtonProps,
} from "./types";

const SubmitButton = memo(
  ({ label, pendingLabel, color }: TSubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        variant="contained"
        color={color}
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
        {pending ? pendingLabel : label}
      </Button>
    );
  }
);

const CancelButton = memo(({ handlerClose }: TCancelButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="button"
      variant="text"
      color="inherit"
      onClick={handlerClose}
      disabled={pending}
      sx={{
        textTransform: "none",
      }}
    >
      Cancel
    </Button>
  );
});

const ConfirmModelComponent = ({
  title,
  isOpen,
  description,
  formAction,
  onClose,
  confirmLabel = "Apply",
  confirmPendingLabel = "Applying...",
  confirmColor = "primary",
  formTestId = "confirm-model-form",
  messageTestId = "confirm-model-message",
  content,
}: TConfirmModelProps) => {
  const handlerClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Modal open={isOpen} onClose={handlerClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
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
              {title}
            </Typography>
            {description !== undefined && (
              <Typography color="text.secondary" data-testid={messageTestId}>
                {description}
              </Typography>
            )}
            <form action={formAction} noValidate data-testid={formTestId}>
              <Stack spacing={2.5}>
                {content}
                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                  <CancelButton handlerClose={handlerClose} />
                  <SubmitButton
                    label={confirmLabel}
                    pendingLabel={confirmPendingLabel}
                    color={confirmColor}
                  />
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export const ConfirmModel = memo(ConfirmModelComponent);

ConfirmModel.displayName = "ConfirmModel";
