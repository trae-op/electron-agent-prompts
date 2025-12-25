import { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import styled from "@emotion/styled";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

export type TFoldersInputProps = {
  folders: string[];
  onChange: (folders: string[]) => void;
};

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

export const FoldersInput = ({ folders, onChange }: TFoldersInputProps) => {
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
