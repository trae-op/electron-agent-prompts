import {
  memo,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import { ConfirmModel } from "@composites/ConfirmModel";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";
import { TUpdateTaskModalProps } from "./types";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadFile = ({ defaultFileName }: { defaultFileName?: string }) => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(
    defaultFileName
  );

  useEffect(() => {
    setSelectedFileName(defaultFileName);
  }, [defaultFileName]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files !== null && files.length > 0 ? files[0] : undefined;

      if (file !== undefined) {
        await window.electron.invoke.uploadFile({
          file,
        });
      }

      setSelectedFileName(file?.name ?? defaultFileName);
    },
    [defaultFileName]
  );

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={pending}
      data-testid="update-task-upload"
    >
      {selectedFileName ?? "No file selected"}
      <VisuallyHiddenInput
        type="file"
        name="file"
        onChange={handleFileChange}
        multiple={false}
        disabled={pending}
        ref={inputRef}
      />
    </Button>
  );
};

const Fields = () => {
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
      <UploadFile defaultFileName={task.url ?? undefined} />
    </Stack>
  );
};

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
  const task = useUpdateTaskModalTaskSelector();
  const setUpdateTask = useSetUpdateTaskModalTaskDispatch();

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (task === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        const response = await window.electron.invoke.updateTask({
          id: task.id,
          name,
          projectId: task.projectId,
          fileId: task.fileId,
          url: task.url,
        });

        if (response !== undefined) {
          onSuccess(response);
          setUpdateTask(undefined);
        }

        return undefined;
      },
      [onSuccess, setUpdateTask, task]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    setUpdateTask(undefined);
  }, [setUpdateTask]);

  return (
    <ConfirmModel
      title="Update task"
      description="Update the task name."
      isOpen={task !== undefined}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Save Changes"
      confirmPendingLabel="Saving..."
      formTestId="update-task-form"
      messageTestId="update-task-message"
      content={<Fields />}
    />
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
