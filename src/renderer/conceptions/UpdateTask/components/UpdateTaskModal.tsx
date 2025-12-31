import { memo, useActionState, useCallback, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";

import { Popup } from "@composites/Popup";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";
import { TFieldsProps, TUpdateTaskModalProps } from "./types";
import { UploadFile } from "@components/UploadFile";
import { FoldersInput } from "@components/FoldersInput";

const Fields = ({ folders, onFoldersChange }: TFieldsProps) => {
  const { pending } = useFormStatus();
  const task = useUpdateTaskModalTaskSelector();

  if (task === undefined) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <TextField
        key={task.id}
        data-testid="update-task-name"
        name="name"
        id="update-task-name"
        label="Task Name"
        placeholder="My agent prompt task"
        defaultValue={task.name}
        autoFocus
        autoComplete="off"
        fullWidth
        disabled={pending}
      />
      <TextField
        key={`ide-${task.id}`}
        select
        name="ide"
        id="update-task-ide"
        label="Target IDE for Instructions"
        defaultValue={task.ide ?? "vs-code"}
        fullWidth
        disabled={pending}
        data-testid="update-task-ide"
      >
        <MenuItem value="vs-code">VS Code</MenuItem>
      </TextField>
      <UploadFile />
      <FoldersInput folders={folders} onChange={onFoldersChange} />
    </Stack>
  );
};

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
  const task = useUpdateTaskModalTaskSelector();
  const setUpdateTask = useSetUpdateTaskModalTaskDispatch();
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  useEffect(() => {
    setSelectedFolders(task?.foldersContentFiles ?? []);
  }, [task?.id, task?.foldersContentFiles]);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (task === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const rawIde = formData.get("ide");
        const ide =
          typeof rawIde === "string" && rawIde.trim().length > 0
            ? rawIde.trim()
            : undefined;

        const response = await window.electron.invoke.updateTask({
          id: task.id,
          name,
          projectId: task.projectId,
          fileId: task.fileId,
          url: task.url,
          folderPaths: selectedFolders,
          ide,
        });

        if (response !== undefined) {
          onSuccess(response);
          setUpdateTask(undefined);
        }

        return undefined;
      },
      [onSuccess, selectedFolders, setUpdateTask, task]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    setUpdateTask(undefined);
    setSelectedFolders([]);
  }, [setSelectedFolders, setUpdateTask]);

  return (
    <Popup
      title="Update task"
      description="Update the task name."
      isOpen={task !== undefined}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Save Changes"
      confirmPendingLabel="Saving..."
      formTestId="update-task-form"
      messageTestId="update-task-message"
      content={
        <Fields
          folders={selectedFolders}
          onFoldersChange={setSelectedFolders}
        />
      }
    />
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
