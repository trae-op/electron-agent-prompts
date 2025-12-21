import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useContentsSelector } from "../context";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

export const SaveButton = () => {
  const { id: taskId } = useParams<{
    id?: string;
  }>();

  const contents = useContentsSelector();
  const handleSave = useCallback(async () => {
    if (!taskId) return;
    await window.electron.invoke.markdownContent({
      taskId,
      contents,
    });
  }, [contents, taskId]);

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={handleSave}
      data-testid="apply-button"
    >
      Save
    </Button>
  );
};

SaveButton.displayName = "SaveButton";
