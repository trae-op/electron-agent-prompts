import { memo, useActionState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { Popup } from "@composites/Popup";
import {
  useUpdateProjectModalProjectSelector,
  useSetUpdateProjectModalProjectDispatch,
} from "../context";
import { TUpdateProjectModalProps } from "./types";
import { useFormStatus } from "react-dom";

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

          const response = await window.electron.invoke.updateProject({
            id: project.id,
            name,
          });

          if (response !== undefined) {
            onSuccess(response);
            setProject(undefined);
          }

          return undefined;
        },
        [onSuccess, project?.id],
      ),
      undefined,
    );

    const handleClose = useCallback(() => {
      setProject(undefined);
    }, [setProject]);

    return (
      <Popup
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
  },
);

UpdateProjectModal.displayName = "UpdateProjectModal";
