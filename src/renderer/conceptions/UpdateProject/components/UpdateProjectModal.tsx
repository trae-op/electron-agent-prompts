import { memo, useActionState, useCallback } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { ConfirmModel } from "@composites/ConfirmModel";
import {
  useUpdateProjectModalProjectSelector,
  useSetUpdateProjectModalProjectDispatch,
} from "../context";
import { TUpdateProjectModalProps } from "./types";
import { useFormStatus } from "react-dom";

const checkboxInputProps = {
  "data-testid": "update-project-is-general",
} as const;

const Fields = () => {
  const { pending } = useFormStatus();
  const project = useUpdateProjectModalProjectSelector();

  if (project === undefined) {
    return null;
  }

  return (
    <Stack spacing={2} key={project.id}>
      <TextField
        data-testid="update-project-name"
        name="name"
        id="update-project-name"
        label="Project Name"
        placeholder="My agent prompt project"
        defaultValue={project.name}
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
            defaultChecked={Boolean(project.isGeneral)}
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

export const UpdateProjectModal = memo(
  ({ onSuccess }: TUpdateProjectModalProps) => {
    const project = useUpdateProjectModalProjectSelector();
    const setProject = useSetUpdateProjectModalProjectDispatch();

    const [_, formAction] = useActionState(
      useCallback(
        async (_state: undefined, formData: FormData): Promise<undefined> => {
          if (project?.id === undefined) {
            return undefined;
          }

          const rawName = formData.get("name");
          const name = typeof rawName === "string" ? rawName.trim() : "";
          const rawIsGeneral = formData.get("isGeneral");
          const isGeneral = rawIsGeneral === "true";

          const response = await window.electron.invoke.updateProject({
            id: project.id,
            name,
            isGeneral,
          });

          if (response !== undefined) {
            onSuccess(response);
            setProject(undefined);
          }

          return undefined;
        },
        [onSuccess, project?.id]
      ),
      undefined
    );

    const handleClose = useCallback(() => {
      setProject(undefined);
    }, [setProject]);

    return (
      <ConfirmModel
        title="Update project"
        description="Rename your project."
        isOpen={project !== undefined}
        onClose={handleClose}
        formAction={formAction}
        confirmLabel="Save Changes"
        confirmPendingLabel="Saving..."
        formTestId="update-project-form"
        messageTestId="update-project-message"
        content={<Fields />}
      />
    );
  }
);

UpdateProjectModal.displayName = "UpdateProjectModal";
