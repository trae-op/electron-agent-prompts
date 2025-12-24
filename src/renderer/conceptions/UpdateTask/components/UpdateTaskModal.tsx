import {
  memo,
  useActionState,
  useCallback,
  useRef,
  ChangeEvent,
  useState,
  useEffect,
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
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

import { Popup } from "@composites/Popup";
import {
  useUpdateTaskModalTaskSelector,
  useSetUpdateTaskModalTaskDispatch,
} from "../context";
import { TFieldsProps, TUpdateTaskModalProps } from "./types";

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

const UploadFile = ({ defaultFileName }: { defaultFileName?: string }) => {
  const { pending } = useFormStatus();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.setAttribute("webkitdirectory", "");
      inputRef.current.setAttribute("directory", "");
    }
  }, []);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files !== null && files.length > 0 ? files[0] : undefined;

      if (file !== undefined) {
        await window.electron.invoke.uploadFile({
          file,
        });
      }
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

type FoldersInputProps = {
  folders: string[];
  onChange: (folders: string[]) => void;
  onTouch: () => void;
};

const FoldersInput = ({ folders, onChange, onTouch }: FoldersInputProps) => {
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
      onTouch();
    },
    [folders, onChange, onTouch]
  );

  const handleRemoveFolder = useCallback(
    (folder: string) => () => {
      onChange(folders.filter((item) => item !== folder));
      onTouch();
    },
    [folders, onChange, onTouch]
  );

  return (
    <Stack spacing={1} data-testid="update-task-folders">
      <Button
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        startIcon={<FolderIcon />}
        disabled={pending}
        data-testid="update-task-folders-input"
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
                    data-testid={`update-task-folder-remove-${folderName}`}
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

const Fields = ({ folders, onFoldersChange, onFoldersTouch }: TFieldsProps) => {
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
      <FoldersInput
        folders={folders}
        onChange={onFoldersChange}
        onTouch={onFoldersTouch}
      />
    </Stack>
  );
};

export const UpdateTaskModal = memo(({ onSuccess }: TUpdateTaskModalProps) => {
  const task = useUpdateTaskModalTaskSelector();
  const setUpdateTask = useSetUpdateTaskModalTaskDispatch();
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [foldersTouched, setFoldersTouched] = useState(false);

  useEffect(() => {
    setSelectedFolders(task?.foldersContentFiles ?? []);
    setFoldersTouched(false);
  }, [task?.id, task?.foldersContentFiles]);

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
          folderPaths: foldersTouched ? selectedFolders : undefined,
        });

        if (response !== undefined) {
          onSuccess(response);
          setUpdateTask(undefined);
          setFoldersTouched(false);
        }

        return undefined;
      },
      [foldersTouched, onSuccess, selectedFolders, setUpdateTask, task]
    ),
    undefined
  );

  const handleClose = useCallback(() => {
    setUpdateTask(undefined);
    setSelectedFolders([]);
    setFoldersTouched(false);
  }, [setFoldersTouched, setSelectedFolders, setUpdateTask]);

  const handleFoldersTouch = useCallback(() => {
    setFoldersTouched(true);
  }, []);

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
          onFoldersTouch={handleFoldersTouch}
        />
      }
    />
  );
});

UpdateTaskModal.displayName = "UpdateTaskModal";
