import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useContentsSelector } from "../context";
import { memo, useCallback } from "react";

export const SaveButton = memo(({ taskId }: { taskId: string }) => {
  const contents = useContentsSelector();
  const handleSave = useCallback(async () => {
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
});

SaveButton.displayName = "SaveButton";
