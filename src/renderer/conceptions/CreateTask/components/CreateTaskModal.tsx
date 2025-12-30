import { memo, useActionState, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Popup } from "@composites/Popup";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps, TFieldsProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";
import { UploadFile } from "@components/UploadFile";
import { FoldersInput } from "@components/FoldersInput";
import { ConnectInstruction } from "@components/ConnectInstruction";

const Fields = ({ folders, onFoldersChange }: TFieldsProps) => {
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
      <UploadFile />
      <ConnectInstruction />
      <FoldersInput folders={folders} onChange={onFoldersChange} />
    </Stack>
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (projectId === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const response = await window.electron.invoke.createTask({
          name,
          projectId,
          folderPaths: selectedFolders,
        });

        if (response !== undefined) {
          closeModal();
          onSuccess(response);
          setSelectedFolders([]);
        }

        return undefined;
      },
      [closeModal, onSuccess, projectId, selectedFolders]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    closeModal();
    setSelectedFolders([]);
  }, [closeModal, setSelectedFolders]);

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
      content={
        <Fields
          folders={selectedFolders}
          onFoldersChange={setSelectedFolders}
        />
      }
    />
  );
});

CreateTaskModal.displayName = "CreateTaskModal";
