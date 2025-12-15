import {
  memo,
  useActionState,
  useCallback,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";

import { ConfirmModel } from "@composites/ConfirmModel";
import { convertBlobToArrayBuffer } from "@utils/file";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps } from "./types";
import { useCreateTaskModalOpenSelector } from "../context";
import { useFormStatus } from "react-dom";

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

type TFieldsProps = {
  selectedFileName?: string;
  onSelectFile: (file?: File) => void;
};

const Fields = ({ selectedFileName, onSelectFile }: TFieldsProps) => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files !== null && files.length > 0 ? files[0] : undefined;
      onSelectFile(file);
    },
    [onSelectFile]
  );

  useEffect(() => {
    if (selectedFileName === undefined && inputRef.current !== null) {
      inputRef.current.value = "";
    }
  }, [selectedFileName]);

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
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        disabled={pending}
        data-testid="create-task-upload"
      >
        {selectedFileName === undefined ? "Upload file" : "Replace file"}
        <VisuallyHiddenInput
          type="file"
          name="file"
          onChange={handleFileChange}
          multiple={false}
          disabled={pending}
          ref={inputRef}
        />
      </Button>
      <Typography
        variant="body2"
        color="text.secondary"
        data-testid="create-task-upload-status"
      >
        {selectedFileName ?? "No file selected"}
      </Typography>
    </Stack>
  );
};

export const CreateTaskModal = memo(({ onSuccess }: TCreateTaskModalProps) => {
  const { projectId } = useParams<{ projectId?: string }>();
  const isOpen = useCreateTaskModalOpenSelector();
  const { closeModal } = useCreateTaskModalActions();
  const [selectedFileName, setSelectedFileName] = useState<
    string | undefined
  >();

  const handleSelectFile = useCallback((file?: File) => {
    setSelectedFileName(file?.name ?? undefined);
  }, []);

  const [_, formAction] = useActionState(
    useCallback(
      async (_state: undefined, formData: FormData): Promise<undefined> => {
        if (projectId === undefined) {
          return undefined;
        }

        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";
        const fileEntry = formData.get("file");
        const file =
          fileEntry instanceof File && fileEntry.size > 0
            ? fileEntry
            : undefined;
        const fileBuffer =
          file !== undefined ? await convertBlobToArrayBuffer(file) : undefined;

        const response = await window.electron.invoke.createTask({
          name,
          projectId,
          file: fileBuffer,
          fileName: file?.name ?? null,
        });

        if (response !== undefined) {
          setSelectedFileName(undefined);
          closeModal();
          onSuccess(response);
        }

        return undefined;
      },
      [closeModal, onSuccess, projectId, setSelectedFileName]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    setSelectedFileName(undefined);
    closeModal();
  }, [closeModal, setSelectedFileName]);

  const isModalOpen = isOpen && projectId !== undefined;

  return (
    <ConfirmModel
      title="Create a new task"
      description="Set the task name for this project."
      isOpen={isModalOpen}
      onClose={handleClose}
      formAction={formAction}
      confirmLabel="Create Task"
      confirmPendingLabel="Creating..."
      formTestId="create-task-form"
      messageTestId="create-task-message"
      content={
        <Fields
          selectedFileName={selectedFileName}
          onSelectFile={handleSelectFile}
        />
      }
    />
  );
});
