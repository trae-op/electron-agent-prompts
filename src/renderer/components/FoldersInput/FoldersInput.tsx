import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

export type TFoldersInputProps = {
  defaultFolders?: string[];
};

export const FoldersInput = ({ defaultFolders }: TFoldersInputProps) => {
  const { pending } = useFormStatus();
  const [folders, setFolders] = useState<string[]>([]);
  const defaultFoldersKey = (defaultFolders ?? []).join("\n");
  const foldersValue = useMemo(() => JSON.stringify(folders), [folders]);

  useEffect(() => {
    setFolders((current) => {
      if (current.join("\n") === defaultFoldersKey) {
        return current;
      }

      return defaultFolders ?? [];
    });
  }, [defaultFolders, defaultFoldersKey]);

  const handleSelectFolders = useCallback(async () => {
    if (pending) {
      return;
    }

    const selectedFolders = await window.electron.invoke.selectFolders();

    if (selectedFolders.length === 0) {
      return;
    }

    setFolders((current) => {
      const set = new Set(current);
      selectedFolders.forEach((folder) => set.add(folder));
      return Array.from(set);
    });
  }, [pending]);

  const handleRemoveFolder = useCallback(
    (folder: string) => () => {
      setFolders((current) => current.filter((item) => item !== folder));
    },
    []
  );

  return (
    <Stack spacing={1} data-testid="create-task-folders">
      <input type="hidden" name="folders" value={foldersValue} readOnly />
      <Button
        variant="outlined"
        startIcon={<FolderIcon />}
        disabled={pending}
        data-testid="create-task-folders-input"
        onClick={handleSelectFolders}
      >
        {folders.length > 0 ? "Add more folders" : "Add folders"}
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
                    data-testid={`folder-remove-${folderName}`}
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
