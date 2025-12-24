import {
  memo,
  useActionState,
  useCallback,
  useState,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
import { useFormStatus } from "react-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import { useParams } from "react-router-dom";

import { Popup } from "@composites/Popup";
import { useCreateTaskModalActions } from "../hooks";
import { TCreateTaskModalProps, TFoldersInputProps } from "./types";
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

const extractFolderPath = (
  file: File,
  resolvedPath?: string
): string | undefined => {
  const fileWithPath = file as File & {
    path?: string;
    webkitRelativePath?: string;
  };

  const absolutePath = resolvedPath ?? fileWithPath.path;

  if (typeof absolutePath === "string") {
    const separatorIndex = Math.max(
      absolutePath.lastIndexOf("\\"),
      absolutePath.lastIndexOf("/")
    );

    return separatorIndex > 0
      ? absolutePath.slice(0, separatorIndex)
      : absolutePath;
  }

  if (typeof fileWithPath.webkitRelativePath === "string") {
    const separatorIndex = fileWithPath.webkitRelativePath.lastIndexOf("/");

    return separatorIndex > 0
      ? fileWithPath.webkitRelativePath.slice(0, separatorIndex)
      : fileWithPath.webkitRelativePath;
  }

  return undefined;
};

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

const FoldersInput = ({ folders, onChange }: TFoldersInputProps) => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.setAttribute("webkitdirectory", "");
      inputRef.current.setAttribute("directory", "");
    }
  }, []);

  const handleFoldersChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;

      if (files === null) {
        return;
      }

      const folderSet = new Set(folders);

      Array.from(files).forEach((file) => {
        const folderPath = extractFolderPath(
          file,
          window.electron.invoke.resolveFilePath(file)
        );

        if (folderPath !== undefined) {
          folderSet.add(folderPath);
        }
      });

      onChange(Array.from(folderSet));
      event.target.value = "";
    },
    [folders, onChange]
  );

  const handleRemoveFolder = useCallback(
    (folder: string) => () => {
      onChange(folders.filter((item) => item !== folder));
    },
    [folders, onChange]
  );

  return (
    <Stack spacing={1} data-testid="create-task-folders">
      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        startIcon={<FolderIcon />}
        disabled={pending}
        data-testid="create-task-folders-input"
      >
        {folders.length > 0 ? "Add more folders" : "Add folders"}
        <VisuallyHiddenInput
          type="file"
          name="folders"
          onChange={handleFoldersChange}
          multiple
          disabled={pending}
          ref={inputRef}
        />
      </Button>
      <List dense>
        {folders.length === 0 ? (
          <ListItem>
            <ListItemText primary="No folders selected" />
          </ListItem>
        ) : (
          folders.map((folder) => {
            const folderName = folder.split(/[/\\]/).pop() ?? folder;

            return (
              <ListItem
                key={folder}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete folder"
                    onClick={handleRemoveFolder(folder)}
                    disabled={pending}
                    data-testid={`create-task-folder-remove-${folderName}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={folderName}
                  secondary={folder}
                  slotProps={{
                    secondary: {
                      noWrap: true,
                      sx: { textOverflow: "ellipsis", overflow: "hidden" },
                    },
                  }}
                />
              </ListItem>
            );
          })
        )}
      </List>
    </Stack>
  );
};

type FieldsProps = {
  folders: string[];
  onFoldersChange: (folders: string[]) => void;
};

const Fields = ({ folders, onFoldersChange }: FieldsProps) => {
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
