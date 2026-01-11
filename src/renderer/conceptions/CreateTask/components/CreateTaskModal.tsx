import { memo, useActionState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import { Popup } from "@composites/Popup";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";
import { UploadFile } from "@components/UploadFile";
import { FoldersInput } from "@components/FoldersInput";
import { parseFoldersFromFormData } from "@utils/folders";

const Fields = () => {
  const { pending } = useFormStatus();

  return (
    <Stack spacing={2}>
      <TextField
        data-testid="create-task-name"
        name="name"
        id="create-task-name"
        label="Task Name"
        placeholder="My agent prompt task"
        autoFocus
        autoComplete="off"
        fullWidth
        disabled={pending}
      />
      <TextField
        select
        name="ide"
        id="create-task-ide"
        label="Target IDE for Instructions"
        defaultValue="vs-code"
        fullWidth
        disabled={pending}
        data-testid="create-task-ide"
      >
        <MenuItem value="vs-code">VS Code</MenuItem>
      </TextField>
      <UploadFile />
      <FoldersInput />
    </Stack>
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();

  const [, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (projectId === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const rawIde = formData.get("ide");
        const ide =
          typeof rawIde === "string" && rawIde.trim().length > 0
            ? rawIde.trim()
            : undefined;

        const folderPaths = parseFoldersFromFormData(formData);

        const response = await window.electron.invoke.createTask({
          name,
          projectId,
          folderPaths,
          ide,
        });

        if (response !== undefined) {
          closeModal();
          onSuccess(response);
        }

        return undefined;
      },
      [closeModal, onSuccess, projectId]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <Popup
      title="Create a new task"
      description="Set the task name for this project."
      isOpen={isOpen && projectId !== undefined}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Create Task"
      confirmPendingLabel="Creating..."
      formTestId="create-task-form"
      messageTestId="create-task-message"
      content={<Fields />}
    />
  );
});

CreateTaskModal.displayName = "CreateTaskModal";
