import {
  memo,
  useActionState,
  useCallback,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

import { ConfirmModel } from "@composites/ConfirmModel";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";

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

const UploadFile = () => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files !== null && files.length > 0 ? files[0] : undefined;

      if (file !== undefined) {
        await window.electron.invoke.uploadFile({
          file,
        });
      }
      setSelectedFileName(file?.name ?? undefined);
    },
    []
  );

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={pending}
      data-testid="create-task-upload"
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
    </Stack>
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();

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
  }, []);

  return (
    <ConfirmModel
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
