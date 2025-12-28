import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import { useContentsSelector } from "@conceptions/Task/Markdown";
import Box from "@mui/material/Box";

export const MarkdownContentListButtons = () => {
  const [padding, setPadding] = useState(false);
  const { id: taskId } = useParams<{
    id?: string;
  }>();

  const contents = useContentsSelector();
  const handleApply = useCallback(async () => {
    if (!taskId) return;
    setPadding(true);
    await window.electron.invoke.markdownContent({
      taskId,
      contents,
    });
    setPadding(false);
  }, [contents, taskId]);

  return (
    <Box
      sx={{
        ml: "auto",
      }}
    >
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleApply}
        disabled={padding}
        loading={padding}
        data-testid="save-button"
      >
        Save
      </Button>
    </Box>
  );
};

MarkdownContentListButtons.displayName = "MarkdownContentListButtons";
