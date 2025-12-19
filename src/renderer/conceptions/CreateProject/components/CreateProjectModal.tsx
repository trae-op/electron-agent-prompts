import { memo, useActionState, useCallback } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import { useCreateProjectModalActions } from "../hooks";
import { TCreateProjectModalProps } from "./types";
import { useCreateProjectModalOpenSelector } from "../context";
import { useFormStatus } from "react-dom";

const checkboxInputProps = {
  "data-testid": "create-project-is-general",
} as const;

const Fields = () => {
  const { pending } = useFormStatus();
  return (
    <Stack spacing={2}>
      <TextField
        data-testid="create-project-name"
        name="name"
        id="create-project-name"
        label="Project Name"
        placeholder="My agent prompt project"
        autoFocus
        autoComplete="off"
        fullWidth
        disabled={pending}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="isGeneral"
            value="true"
            disabled={pending}
            slotProps={{
              input: checkboxInputProps,
            }}
          />
        }
        label="Mark as general project"
      />
    </Stack>
  );
};

export const CreateProjectModal = memo(
  ({ onSuccess }: TCreateProjectModalProps) => {
    const isOpen = useCreateProjectModalOpenSelector();
    const { closeModal } = useCreateProjectModalActions();

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          const rawName = formData.get("name");
          const name = typeof rawName === "string" ? rawName.trim() : "";
          const rawIsGeneral = formData.get("isGeneral");
          const isGeneral = rawIsGeneral === "true";

          const response = await window.electron.invoke.createProject({
            name,
            isGeneral,
          });

          if (response !== undefined) {
            closeModal();
            onSuccess(response);
          }

          return undefined;
        },
        [closeModal, onSuccess]
      ),
      undefined
    );

    const handleClose = useCallback(() => {
      closeModal();
    }, [closeModal]);

    return (
      <Popup
        title="Create a new project"
        description="Set the project name to get started."
        isOpen={isOpen}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel="Create Project"
        confirmPendingLabel="Creating..."
        formTestId="create-project-form"
        messageTestId="create-project-message"
        content={<Fields />}
      />
    );
  }
);
