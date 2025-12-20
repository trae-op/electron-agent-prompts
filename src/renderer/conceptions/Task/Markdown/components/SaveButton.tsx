import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useContentsSelector } from "../context";
import { useCallback } from "react";

export const SaveButton = () => {
  const contents = useContentsSelector();
  const handleSave = useCallback(async () => {
    const response = await window.electron.invoke.markdownContent({
      contents,
    });
  }, [contents]);

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
